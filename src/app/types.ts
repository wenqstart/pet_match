export interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | "other";
  breed: string;
  gender: "male" | "female";
  age: number;
  birthday: string;
  avatar: string;
  personality: string[];
  owner: string;
  bio: string;
  lookingFor: string;
}

export interface Expense {
  id: string;
  petId: string;
  category: "food" | "medical" | "toys" | "grooming" | "other";
  amount: number;
  description: string;
  date: string;
}

export interface Anniversary {
  id: string;
  petId: string;
  title: string;
  date: string;
  type: "birthday" | "adoption" | "custom";
  notes?: string;
}
