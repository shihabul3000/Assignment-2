import { pool } from "../../config/db";

const getAllUsers = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users ORDER BY id`);
    return result.rows;
};

const updateUser = async (id: number, updates: any) => {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }
    }

    if (fields.length === 0) {
        throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, phone, role`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    return result.rows[0];
};

const deleteUser = async (id: number) => {
    // Check for active bookings
    const activeBookings = await pool.query(`SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`, [id]);
    if (activeBookings.rows.length > 0) {
        throw new Error("Cannot delete user with active bookings");
    }

    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }
};

export const usersService = {
    getAllUsers,
    updateUser,
    deleteUser,
};