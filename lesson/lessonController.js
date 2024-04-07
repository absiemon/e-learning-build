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
const prisma = new PrismaClient();
export const areYouACreatorOfThisCourse = (user_id, course_id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma.course.findUnique({
        where: {
            id: course_id,
        },
    });
    if ((course === null || course === void 0 ? void 0 : course.user_id) !== user_id) {
        return false;
    }
    return true;
});
//Api to create a lesson for a particular course
export const createLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    const course_id = req.query.course_id;
    try {
        //checking if course is given or not
        if (!course_id) {
            return res.status(400).json({ error: "course_id is required" });
        }
        //you can only create lesson if you are the creator of the course
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!(yield areYouACreatorOfThisCourse(user_id, course_id))) {
            return res.status(400).json({ error: "you are not authorize to create lesson!" });
        }
        //checking whether the given lesson number is already created for this course
        const existingLession = yield prisma.lesson.findFirst({
            where: {
                course_id: course_id,
                lesson_number: data.lesson_number,
            }
        });
        if (existingLession) {
            return res.status(400).json({ error: "The lesson for the course already exists!" });
        }
        //if all check passed then create a lesson for a course
        const newLession = yield prisma.lesson.create({
            data: Object.assign(Object.assign({}, data), { course: { connect: { id: course_id } } }),
        });
        return res.status(201).json(newLession);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//Api to get all the lesson for a course sort by lesson number in increasing order
export const getAllLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const course_id = req.query.course_id;
    try {
        //checking if course is given or not
        if (!course_id) {
            return res.status(400).json({ error: "course_id is required" });
        }
        //you can only get all lessons if you are the creator of the course
        const user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!(yield areYouACreatorOfThisCourse(user_id, course_id))) {
            return res.status(400).json({ error: "you are not the authorize to get the lessons." });
        }
        //get all the lesson for a given course id sort by lesson number in increasing order
        const lessons = yield prisma.lesson.findMany({
            where: {
                course_id: course_id,
            },
            orderBy: {
                lesson_number: 'asc'
            }
        });
        return res.status(200).json(lessons);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//api to edit the lesson description. For now no way to update lesson number 
export const updateLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const lesson_id = req.params.id;
    const { description, course_id } = req.body;
    try {
        //checking if course is given or not
        if (!lesson_id) {
            return res.status(400).json({ error: "lesson id is required" });
        }
        //you can only update lesson if you are the creator of the course
        const user_id = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        if (!(yield areYouACreatorOfThisCourse(user_id, course_id))) {
            return res.status(400).json({ error: "you are not the authorize to update the lessons." });
        }
        //if all check passed then update the lesson
        yield prisma.lesson.update({
            where: {
                id: lesson_id,
            },
            data: {
                description: description,
            },
        });
        return res.status(200).json({ message: "Successfully updated lesson description" });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//Api to delete a lesson
export const deleteLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const lesson_id = req.query.lesson_id;
    const course_id = req.query.course_id;
    try {
        //checking if course is given or not
        if (!lesson_id || !course_id) {
            return res.status(400).json({ error: "lesson id and course id is required" });
        }
        //you can only delete lesson if you are the creator of the course
        const user_id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        if (!(yield areYouACreatorOfThisCourse(user_id, course_id))) {
            return res.status(400).json({ error: "you are not the authorize to delete the lessons." });
        }
        //if all check passed then delete the lesson
        yield prisma.lesson.delete({
            where: {
                id: lesson_id,
            },
        });
        //if a lesson is deleted then also delete the videos of that lesson
        yield prisma.video.deleteMany({
            where: {
                lesson_id: lesson_id,
            },
        });
        return res.status(200).json({ message: "Successfully deleted the lesson!" });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//# sourceMappingURL=lessonController.js.map