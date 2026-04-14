import { ApiError } from "../middlewares/ApiError";
import { ReportRepository } from "../repositories/reportrepository";
import RegionService from "./regionService";
class ReportService {
    static async getAll() {
        return await ReportRepository.findAll();
    }

    static async getById(id: number) {
        const report = await ReportRepository.findById(id);
        if (!report) {
            throw ApiError.notFound(`Report with id ${id} not found`);
        }
        return report;
    }

    static async create(data: {
        crimedate: string;
        crimetime?: string;
        reportdate: string;
        description: string;
        status: string;
        image_url?: string;
        userid: number;
        regionid: number;
        hadasid: number;
    }) {
        return await ReportRepository.create(data);
    }

    static async update(
        id: number,
        updateData: {
            crimedate: string;
            crimetime?: string;
            reportdate: string;
            description: string;
            status: string;
            image_url?: string;
            userid: number;
            regionid: number;
            hadasid: number;
        },
    ) {
        const report = await ReportRepository.update(id, updateData);
        if (!report) {
            throw ApiError.notFound(`Report with id ${id} not found`);
        }
        return report;
    }

    static async remove(id: number) {
        const deleted = await ReportRepository.remove(id);
        if (!deleted) {
            throw ApiError.notFound(`Report with id ${id} not found`);
        }
        return { success: true, message: "Report deleted" };
    }
}

export default ReportService;
