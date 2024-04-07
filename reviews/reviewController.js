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
import { userFields } from '../auth/types.js';
const prisma = new PrismaClient();
// API to create or give a review on a course by the user
export const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { description, stars, course_id } = req.body;
    try {
        //getting the user from the req body after token verification.
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        //you cannot give review if you are creator of a course
        const course = yield prisma.course.findFirst({
            where: {
                id: course_id,
            },
        });
        if ((course === null || course === void 0 ? void 0 : course.user_id) === user_id) {
            return res.status(400).json({ error: 'You cannot give review on this course!' });
        }
        //you cannot give review if you are not enrolled in this course
        const enrollment = yield prisma.enrollment.findFirst({
            where: {
                user_id: user_id,
                course_id: course_id,
            }
        });
        if (!enrollment) {
            return res.status(400).json({ error: "You cannot give review on this course! as you have not enrolled!" });
        }
        //checking if the user has already given review on this course or not.
        const existingReview = yield prisma.review.findFirst({
            where: {
                user_id: user_id,
                course_id: course_id,
            },
        });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already given a review on this course' });
        }
        //creating a new review
        const newReview = yield prisma.review.create({
            data: {
                description: description,
                stars: stars,
                user: { connect: { id: user_id } },
                course: { connect: { id: course_id } }
            },
        });
        return res.status(201).json(newReview);
    }
    catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Api to get all the reviews on a particular course
export const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const courseId = req.query.course_id;
    try {
        //if course id is not given
        if (!courseId) {
            return res.status(400).json({ error: 'course_id is required' });
        }
        //counting total reviews on a course
        const totalCount = yield prisma.review.count({
            where: {
                course_id: courseId,
            },
        });
        const totalPages = Math.ceil(totalCount / pageSize);
        //getting all the reviews for the course
        const reviews = yield prisma.review.findMany({
            where: {
                course_id: courseId,
            },
            include: {
                user: {
                    select: userFields
                }
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
        });
        return res.status(200).json({
            data: reviews,
            totalPages,
            currentPage: page,
            pageSize,
            totalCount,
        });
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Api to update the review given by the user
export const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const reviewId = req.params.id;
    const data = req.body;
    try {
        //checking if the review id is given or not
        if (!reviewId) {
            return res.status(400).json({ error: 'review_id is required' });
        }
        //update will only happen if you have given this review
        const user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const review = yield prisma.review.findFirst({
            where: {
                id: reviewId,
            },
        });
        if ((review === null || review === void 0 ? void 0 : review.user_id) !== user_id) {
            return res.status(400).json({ error: 'You are not authorized to update this review' });
        }
        //updating the review
        const updatedReview = yield prisma.review.update({
            where: {
                id: reviewId,
            },
            data: Object.assign({}, data),
        });
        return res.status(200).json(updatedReview);
    }
    catch (error) {
        console.error('Error updating review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Apis to delete the review made the user
export const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const reviewId = req.params.id;
    try {
        //checking if the review id is given or not
        if (!reviewId) {
            return res.status(400).json({ error: 'review_id is required' });
        }
        //delete will only happen if if you have given this review
        const user_id = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const review = yield prisma.review.findFirst({
            where: {
                id: reviewId,
            },
        });
        if ((review === null || review === void 0 ? void 0 : review.user_id) !== user_id) {
            return res.status(400).json({ error: 'You are not authorized to delete this review' });
        }
        //deleting the review
        yield prisma.review.delete({
            where: {
                id: reviewId,
            },
        });
        return res.status(200).json({ message: "Deleted Successfully!" });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=reviewController.js.map