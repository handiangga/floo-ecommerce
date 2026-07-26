"use strict";

const { sequelize } = require("../../models");

const reviewRepository = require("../repositories/review.repository");

const REVIEW_STATUS = require("../constants/reviewStatus");

class ReviewService {
  async create(payload) {
    const transaction = await sequelize.transaction();

    try {
      const exist = await reviewRepository.findByOrderItem(
        payload.order_item_id,
      );

      if (exist) {
        const error = new Error("Review already exists for this order item");

        error.statusCode = 400;

        throw error;
      }
      const { images = [], ...review } = payload;

      const createdReview = await reviewRepository.create(review, transaction);

      if (images.length > 0) {
        const reviewImages = images.map((image, index) => ({
          review_id: createdReview.id,
          image,
          sort_order: index,
        }));

        await reviewRepository.bulkCreateImages(reviewImages, transaction);
      }

      await transaction.commit();

      return reviewRepository.findById(createdReview.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query) {
    return reviewRepository.findAll(query);
  }

  async findById(id) {
    const review = await reviewRepository.findById(id);

    if (!review) {
      const error = new Error("Review not found");
      error.statusCode = 404;
      throw error;
    }

    return review;
  }

  async approve(id) {
    await this.findById(id);

    await reviewRepository.update(id, {
      status: REVIEW_STATUS.APPROVED,
    });

    return reviewRepository.findById(id);
  }

  async reject(id) {
    await this.findById(id);

    await reviewRepository.update(id, {
      status: REVIEW_STATUS.REJECTED,
    });

    return reviewRepository.findById(id);
  }

  async delete(id) {
    const review = await this.findById(id);

    const transaction = await sequelize.transaction();

    try {
      await reviewRepository.destroyImages(review.id, transaction);

      await reviewRepository.delete(review.id, transaction);

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getSummary(product_id) {
    return {
      summary: await reviewRepository.getSummary(product_id),
      distribution: await reviewRepository.getRatingDistribution(product_id),
    };
  }
}

module.exports = new ReviewService();
