export interface Department {
  id: string;
  label: string;
}

export const departments: Department[] = [
  { id: "Computer Science", label: "Computer Science" },
  { id: "Information Technology", label: "Information Technology" },
  { id: "Electronics and Communication", label: "Electronics and Communication" },
  { id: "Electrical Engineering", label: "Electrical Engineering" },
  { id: "Mechanical Engineering", label: "Mechanical Engineering" },
  { id: "Civil Engineering", label: "Civil Engineering" },
];

// Helper function to get department label by ID
export const getDepartmentLabel = (id: string): string => {
  const dept = departments.find(d => d.id === id);
  return dept ? dept.label : id;
};

// Helper function to get department ID by label
export const getDepartmentId = (label: string): string => {
  const dept = departments.find(d => d.label === label);
  return dept ? dept.id : label;
}; 