import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export { supabase };

// Re-export types from the auto-generated types
export type Student = Tables<'students'>;
export type Class = Tables<'classes'>;
export type AttendanceRecord = Tables<'attendance_records'>;

export type StudentInsert = TablesInsert<'students'>;
export type StudentUpdate = TablesUpdate<'students'>;
export type ClassInsert = TablesInsert<'classes'>;
export type ClassUpdate = TablesUpdate<'classes'>;
export type AttendanceRecordInsert = TablesInsert<'attendance_records'>;

// Helper functions for database operations
export const studentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select('*, classes(name)')
      .eq('is_active', true)
      .order('first_name');
    
    if (error) throw error;
    return data;
  },

  async create(student: StudentInsert) {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: StudentUpdate) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const classService = {
  async getAll() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async create(classData: ClassInsert) {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ClassUpdate) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const attendanceService = {
  async markAttendance(records: AttendanceRecordInsert[]) {
    const { data, error } = await supabase
      .from('attendance_records')
      .upsert(records, { 
        onConflict: 'student_id,class_id,date'
      })
      .select();
    
    if (error) throw error;
    return data;
  },

  async getClassAttendance(classId: string, date: string) {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        students (
          id,
          student_id,
          first_name,
          last_name
        )
      `)
      .eq('class_id', classId)
      .eq('date', date);
    
    if (error) throw error;
    return data;
  },

  async getStudentAttendance(studentId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('attendance_records')
      .select(`
        *,
        classes (
          id,
          name
        )
      `)
      .eq('student_id', studentId);

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAttendanceReport(classId?: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('attendance_records')
      .select(`
        *,
        students (
          id,
          student_id,
          first_name,
          last_name
        ),
        classes (
          id,
          name
        )
      `);

    if (classId) query = query.eq('class_id', classId);
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
