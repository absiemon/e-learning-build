var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { PrismaClient } from '@prisma/client';
import { areYouACreatorOfThisCourse } from '../lesson/lessonController.js';
import { userFields } from '../auth/types.js';
const prisma = new PrismaClient();
// API to Create Course
export const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const _b = req.body, { title } = _b, restData = __rest(_b, ["title"]);
    try {
        // Check if course title already exists
        const existingCourse = yield prisma.course.findFirst({
            where: {
                title: title,
            },
        });
        if (existingCourse) {
            return res.status(400).json({ error: 'Course title already exists' });
        }
        //getting the user id(course creator) after token verification.
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Create the course
        const newCourse = yield prisma.course.create({
            data: Object.assign(Object.assign({ title: title }, restData), { user: { connect: { id: user_id } } }),
        });
        //If you are creating a course you will be automatically enrolled in the course to get full access to the course.
        yield prisma.enrollment.create({
            data: {
                course: { connect: { id: newCourse.id } },
                user: { connect: { id: user_id } }
            },
        });
        return res.status(201).json(newCourse);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
// API to get a single Course
export const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const course_id = req.params.id;
    try {
        //check if the video id and course id are there
        if (!course_id) {
            return res.status(400).json({ error: "course id is required" });
        }
        const course = yield prisma.course.findUnique({
            where: {
                id: course_id,
            },
            include: {
                user: {
                    select: userFields
                } // Including the creator details
            }
        });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        //getting all the reviews of this course
        const reviews = yield prisma.review.findMany({
            where: {
                course_id: course_id,
            },
            include: {
                user: {
                    select: userFields
                }
            }
        });
        //getting number of enrolled user
        const numberOfEnrolledUsers = yield prisma.enrollment.count({
            where: {
                course_id: course_id,
            },
        });
        //If you are enrolled in this course then you will see lessons and videos along with the reviews
        const user_id = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        //checking whether you are enrolled in the course or not.
        const enrollmentCheck = yield prisma.enrollment.findFirst({
            where: {
                course_id: course.id,
                user_id: user_id,
            }
        });
        //if you are not enrolled you can only see course details along with the reviews
        if (!enrollmentCheck) {
            return res.status(200).json({
                course: course,
                reviews: reviews,
                numberOfEnrolledUsers
            });
        }
        //fetching all the lessons of a course along with the videos. all videos for a particular lesson will be inside the lesson object
        const lessons = yield prisma.lesson.findMany({
            where: {
                course_id: course.id,
            },
            include: {
                Video: true,
            }
        });
        return res.status(200).json({
            course: course,
            reviews: reviews,
            numberOfEnrolledUsers,
            lessons: lessons
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
// API to get all the Course created by the user.
export const getAllCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const user_id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    //adding pagination
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const category = req.query.category;
    const priceAsc = req.query.priceAsc;
    const createdAtAsc = req.query.createdAtAsc;
    try {
        //other filtering options like category, price
        let query = {};
        let sortBy = [];
        if (category) {
            query.category = category;
        }
        if (priceAsc) {
            priceAsc === 'true' ?
                sortBy.push({ price: 'asc' }) :
                sortBy.push({ price: 'desc' });
        }
        if (createdAtAsc) {
            createdAtAsc === 'true' ?
                sortBy.push({ created_at: 'asc' }) :
                sortBy.push({ created_at: 'desc' });
        }
        //counting total available records
        const totalCount = yield prisma.course.count({
            where: Object.assign({ user_id: user_id }, query)
        });
        const totalPages = Math.ceil(totalCount / pageSize);
        //getting all the courses created by a user
        const courses = yield prisma.course.findMany({
            where: Object.assign({ user_id: user_id }, query),
            orderBy: sortBy,
            take: pageSize,
            skip: (page - 1) * pageSize,
        });
        return res.status(200).json({
            data: courses,
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
//Api to get all available courses with filtering and sorting
export const getAllAvailableCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //adding pagination
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const category = req.query.category;
    const priceAsc = req.query.priceAsc;
    const createdAtAsc = req.query.createdAtAsc;
    const popularity = req.query.popularity;
    try {
        //other filtering options like category, price
        let query = {};
        let sortBy = [];
        if (category) {
            query.category = category;
        }
        if (priceAsc) {
            priceAsc === 'true' ?
                sortBy.push({ price: 'asc' }) :
                sortBy.push({ price: 'desc' });
        }
        if (createdAtAsc) {
            createdAtAsc === 'true' ?
                sortBy.push({ created_at: 'asc' }) :
                sortBy.push({ created_at: 'desc' });
        }
        //counting total available courses
        const totalCount = yield prisma.course.count({});
        const totalPages = Math.ceil(totalCount / pageSize);
        //getting all the available courses
        const courses = yield prisma.course.findMany({
            where: Object.assign({}, query),
            orderBy: sortBy,
            take: pageSize,
            skip: (page - 1) * pageSize,
        });
        //sorting the courses based on popularity(number of enrolled user in that course)
        // Modifying the course to include the number of enrolled user for each course
        //since we have implemented pagination api response time won't hardly
        let modifiedCourse = yield Promise.all(courses.map((course) => __awaiter(void 0, void 0, void 0, function* () {
            const numberOfEnrollments = yield prisma.enrollment.count({
                where: {
                    course_id: course.id
                }
            });
            return Object.assign(Object.assign({}, course), { enrollmentCount: numberOfEnrollments });
        })));
        // Sort by enrollment count
        if (popularity === 'true') {
            modifiedCourse.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        }
        else {
            modifiedCourse.sort((a, b) => a.enrollmentCount - b.enrollmentCount);
        }
        return res.status(200).json({
            data: modifiedCourse,
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
// API to Update Course
export const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const course_id = req.params.id;
    const data = req.body;
    try {
        //check if the video id and course id are there
        if (!course_id) {
            return res.status(400).json({ error: "course id is required" });
        }
        //you can only update the course if you are the creator of the course
        const user_id = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        if (!(yield areYouACreatorOfThisCourse(course_id, user_id))) {
            return res.status(400).json({ error: "you are not the authorize to update the course." });
        }
        console.log(user_id);
        const updatedCourse = yield prisma.course.update({
            where: {
                id: course_id,
            },
            data: Object.assign({}, data),
        });
        return res.status(200).json(updatedCourse);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
// API to Delete a Course
export const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const course_id = req.params.id;
    try {
        //check if the course id is there
        if (!course_id) {
            return res.status(400).json({ error: "course id is required" });
        }
        //you can only delete the course if you are the creator of the course
        const user_id = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
        if (!(yield areYouACreatorOfThisCourse(course_id, user_id))) {
            return res.status(400).json({ error: "you are not the authorize to delete the course." });
        }
        //deleting the course
        yield prisma.course.delete({
            where: {
                id: course_id,
            },
        });
        //If the course is being deleted then delete the lesson associated with the course,
        //delete the videos associated with the lessons, delete the enrollments in the course as well
        yield prisma.lesson.deleteMany({
            where: {
                course_id: course_id,
            },
        });
        yield prisma.video.deleteMany({
            where: {
                course_id: course_id,
            },
        });
        yield prisma.enrollment.deleteMany({
            where: {
                course_id: course_id,
            },
        });
        return res.status(200).json({ message: "Deleted Successfully!" });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//# sourceMappingURL=courseController.js.map