var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../middleware/sendEmail.js';
import { userFields } from '../auth/types.js';
const prisma = new PrismaClient();
// API to enroll in a course Course
export const enrollInCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { course_id } = req.body;
    try {
        //getting the user id after token verification
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        //check if the user id and course id are there
        if (!course_id || !user_id) {
            return res.status(400).json({ error: "user id and course id is required!" });
        }
        //check if the user is already enrolled in the course
        const enrollment = yield prisma.enrollment.findFirst({
            where: {
                user_id: user_id,
                course_id: course_id,
            }
        });
        if (enrollment) {
            return res.status(400).json({ error: "You are already enrolled in this course!" });
        }
        //create the enrollment
        yield prisma.enrollment.create({
            data: {
                user: { connect: { id: user_id } },
                course: { connect: { id: course_id } },
            },
        });
        //getting course creator details
        const course = yield prisma.course.findFirst({
            where: {
                id: course_id
            },
            include: {
                user: {
                    select: userFields
                }
            }
        });
        //send the email to the creator of the course along with the enrolled user details
        const htmlContent = `
            <h1>Enrollment Details</h1>
            <ul>
                <li>
                    <p><strong>Course Title:</strong> ${course === null || course === void 0 ? void 0 : course.title}</p>
                    <p><strong>User Name:</strong> ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.username}</p>
                    <p><strong>Email:</strong> ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.email}</p>
                </li>
            </ul>`;
        const payload = {
            to: course === null || course === void 0 ? void 0 : course.user.email,
            subject: "Enrollment details",
            html: htmlContent
        };
        yield sendEmail(payload);
        return res.status(200).json({ message: "Successfully enrolled in the course!" });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//Api to get all the enrollments by the user
export const getAllEnrolledCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    //pagination 
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        //getting the user id after token verification
        const user_id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        //counting total enrolled courses
        const totalCount = yield prisma.enrollment.count({
            where: {
                user_id: user_id,
            },
        });
        const totalPages = Math.ceil(totalCount / pageSize);
        //getting all the enrollments for the user
        const enrollments = yield prisma.enrollment.findMany({
            where: {
                user_id: user_id,
            },
            include: {
                course: {
                    include: {
                        user: {
                            select: userFields
                        } // Including the user details who created this course
                    },
                },
                user: {
                    select: userFields
                } // Including the user details who has enrolled in this course
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return res.status(200).json({
            data: enrollments,
            totalPages,
            currentPage: page,
            pageSize,
            totalCount,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//Api to get all the enrolled user for a course
export const getAllUserEnrolledInCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course_id = req.query.course_id;
    //pagination 
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        //check if the user id and course id are there
        if (!course_id) {
            return res.status(400).json({ error: "course id is required!" });
        }
        //counting total user enrolled in this course
        const totalCount = yield prisma.enrollment.count({
            where: {
                course_id: course_id,
            },
        });
        const totalPages = Math.ceil(totalCount / pageSize);
        //getting all the enrollments for the user
        const usersEnrolled = yield prisma.enrollment.findMany({
            where: {
                course_id: course_id,
            },
            include: {
                course: true,
                user: {
                    select: userFields
                }
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return res.status(200).json({
            data: usersEnrolled,
            totalPages,
            currentPage: page,
            pageSize,
            totalCount,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//# sourceMappingURL=enrollmentController.js.map