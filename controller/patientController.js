import Patient from "../model/Patient.js";
import { Sequelize } from "sequelize";
import Status from "../model/PatientStatus.js";
import Address from "../model/Address.js";
import { validationResult } from 'express-validator';

export class PatientController {
    index = async (req, res) => {
        try {
            // Destructuring objek query dari request
            const { name, address, status, sort, order } = req.query;

            // Membuat objek query untuk filter
            const query = {};
            if (name) query.name = { [Sequelize.Op.like]: `%${name}%` };
            if (address) query['$address.address$'] = { [Sequelize.Op.like]: `%${address}%` };
            if (status) query['$status.status$'] = { [Sequelize.Op.eq]: status };

            // Pengaturan untuk menyertakan relasi Status dan Address pada hasil query
            const includeOptions = [
                {
                    model: Status,
                    as: 'status',
                    attributes: ['status', 'tanggal_masuk', 'tanggal_keluar'],
                },
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address'],
                }
            ];

            // Pengaturan untuk pengurutan hasil query
            const orderBy = sort && ["name", "tanggal_masuk", "tanggal_keluar", "address"].includes(sort.toLowerCase()) ? [
                [sort === "name" ? "name" : `$status.${sort.toLowerCase()}$`, order && order.toLowerCase() === "desc" ? "DESC" : "ASC"]
            ] : [];

            // Menjalankan query untuk mendapatkan data pasien
            const patients = await Patient.findAll({ where: query, include: includeOptions, order: orderBy });

            // Menangani respons berdasarkan hasil query
            const statusCode = patients.length > 0 ? 200 : 404;
            const message = patients.length > 0 ? "Menampilkan data pasien" : "Tidak ditemukan data pasien";

            res.status(statusCode).json({ message, data: patients });
        } catch (error) {
            // Menangani kesalahan internal server
            res.status(500).json({ message: `Kesalahan Internal Server: ${error.message}` });
        }
    };

    store = async (req, res) => {
        try {
            // Validasi input menggunakan express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validasi gagal', errors: errors.array() });
            }

            // Destructuring objek body dari request
            const { name, phone, address, status, tanggal_masuk, tanggal_keluar } = req.body;

            // Membuat status dan alamat baru
            const newStatus = await Status.create({ status, tanggal_masuk, tanggal_keluar });
            const newAddress = await Address.create({ address });

            // Membuat pasien baru dengan status dan alamat yang sudah dibuat
            const newPatient = await Patient.create({ name, phone, addressId: newAddress.id, statusId: newStatus.id });

            // Menampilkan respons dengan data pasien yang baru ditambahkan
            res.status(201).json({ message: "Data pasien berhasil ditambahkan", data: newPatient });
        } catch (error) {
            // Menangani kesalahan internal server
            res.status(500).json({ message: `Internal Server Error: ${error.message}` });
        }
    };

    update = async (req, res) => {
        try {
            // Mendapatkan ID pasien dari parameter URL
            const patientId = req.params.id;

            // Mencari data pasien, alamat, dan status berdasarkan ID
            const findPatient = await Patient.findByPk(patientId);
            const findAddress = await Address.findByPk(findPatient.addressId);
            const findStatus = await Status.findByPk(findPatient.statusId);

            // Memastikan data pasien, alamat, dan status ditemukan
            if (!findPatient || !findAddress || !findStatus) {
                return res.status(404).json({
                    message: "Patient not found"
                });
            }

            // Mendapatkan data yang dikirimkan dalam request body
            const { name, phone, address, status, tanggal_masuk, tanggal_keluar } = req.body;

            // Update Alamat
            const dataAddress = {
                address: address || findAddress.address
            };
            await findAddress.update(dataAddress);

            // Update Status
            const dataStatus = {
                status: status || findStatus.status,
                tanggal_masuk: tanggal_masuk || findStatus.tanggal_masuk,
                tanggal_keluar: tanggal_keluar || findStatus.tanggal_keluar
            };
            await findStatus.update(dataStatus);

            // Update Pasien
            const dataPatient = {
                name: name || findPatient.name,
                phone: phone || findPatient.phone
            };
            await findPatient.update(dataPatient);

            // Menampilkan respons jika pasien berhasil di-update
            res.json({
                message: "Pasien berhasil diperbarui",
                data: findPatient
            });
        } catch (error) {
            // Menangani kesalahan internal server
            res.status(500).json({
                message: `Kesalahan Internal Server: ${error.message}`
            });
        }
    };

    destroy = async (req, res) => {
        try {
            const patientId = req.params.id;

            // Mencari data pasien berdasarkan ID dengan eager loading
            const findPatient = await Patient.findByPk(patientId, {
                include: [
                    { model: Address, as: 'address' },
                    { model: Status, as: 'status' }
                ]
            });

            // Memastikan data pasien ditemukan
            if (!findPatient) {
                return res.status(404).json({ message: "Patient not found" });
            }

            // Menghapus Alamat, Status, dan Pasien
            await Promise.all([
                findPatient.address.destroy(),
                findPatient.status.destroy(),
                findPatient.destroy()
            ]);

            // Menampilkan respons jika pasien berhasil dihapus
            res.json({ message: "Pasien berhasil dihapus", data: findPatient });
        } catch (error) {
            // Menangani kesalahan internal server
            res.status(500).json({ message: `Kesalahan Internal Server: ${error.message}` });
        }
    };

    show = async (req, res) => {
        try {
            // Mendapatkan ID pasien dari parameter URL
            const patientId = req.params.id;

            // Menggabungkan informasi status dan alamat pada data pasien
            const patient = await Patient.findOne({
                where: { id: patientId },
                include: [
                    { model: Status, as: 'status', attributes: ['status', 'tanggal_masuk', 'tanggal_keluar'] },
                    { model: Address, as: 'address', attributes: ['address'] }
                ]
            });

            // Memastikan data pasien ditemukan
            if (!patient) {
                return res.status(404).json({ message: "Data pasien tidak ditemukan" });
            }

            // Menampilkan respons jika data pasien berhasil diambil
            res.json({ message: "Data pasien berhasil diambil", data: patient });
        } catch (error) {
            // Menangani kesalahan internal server
            res.status(500).json({ message: `Kesalahan Internal Server: ${error.message}` });
        }
    };

}

const patients = new PatientController();

export default patients;
