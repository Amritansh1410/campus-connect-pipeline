import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  class_id: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  class_code: string;
  name: string;
  instructor: string;
  schedule: string;
  room: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
  created_at: string;
}

// Helper functions for database operations
export const studentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select('*, classes(name)')
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Student>) {
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
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async create(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Class>) {
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
  async markAttendance(records: Omit<AttendanceRecord, 'id' | 'created_at'>[]) {
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
          name
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
          class_code,
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
          name
        ),
        classes (
          id,
          class_code,
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