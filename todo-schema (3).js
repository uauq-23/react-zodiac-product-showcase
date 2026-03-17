import db from '../db/db.js';

const TABLE_NAME = 'refresh_tokens';
const dbInstance = db(TABLE_NAME);

export default {
    create: async (tokenData) => {
        const [newToken] = await dbInstance.clone().insert(tokenData).returning('*');
        return newToken;
    },

    findByToken: async (hashedToken) => {
        return dbInstance.clone()
            .where({ token: hashedToken, is_revoked: false })
            .first();
    },

    findById: async (id) => {
        return dbInstance.clone().where({ id }).first();
    },

    findByUserId: async (userId) => {
        return dbInstance.clone()
            .where({ user_id: userId, is_revoked: false });
    },

    revokeById: async (id) => {
        return dbInstance.clone()
            .where({ id })
            .update({ is_revoked: true, revoked_at: new Date() });
    },

    revokeByToken: async (hashedToken) => {
        return dbInstance.clone()
            .where({ token: hashedToken })
            .update({ is_revoked: true, revoked_at: new Date() });
    },

    revokeFamily: async (family) => {
        return dbInstance.clone()
            .where({ family })
            .update({ is_revoked: true, revoked_at: new Date() });
    },

    revokeAllByUserId: async (userId) => {
        return dbInstance.clone()
            .where({ user_id: userId, is_revoked: false })
            .update({ is_revoked: true, revoked_at: new Date() });
    },

    deleteExpired: async () => {
        return dbInstance.clone()
            .where('expires_at', '<', new Date())
            .del();
    },

    isRevoked: async (hashedToken) => {
        const token = await dbInstance.clone()
            .where({ token: hashedToken })
            .first();
        return token ? token.is_revoked : true;
    },

    countActiveByUserId: async (userId) => {
        const result = await dbInstance.clone()
            .where({ user_id: userId, is_revoked: false })
            .where('expires_at', '>', new Date())
            .count('id as count')
            .first();
        return parseInt(result.count);
    }
};
