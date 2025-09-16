import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

type Grade = { name: string };

type filtersType = {
  experience: string;
  teachingStyle: number[];
  verification: string;
  lang: string;
  gender: string;
  time: string;
  curriculam: number[];
  rating: string;
  grade: Grade[];
  location: string;
  latitude: string;
  longitude: string;
};

interface FilterContextType {
  filters: filtersType;
  setFilters: Dispatch<SetStateAction<filtersType>>;
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
  time: { startTime: string; endTime: string };
  setTime: Dispatch<SetStateAction<{ startTime: string; endTime: string }>>;
  selectedSubjects: string[];
  // setSelectedSubjects: Dispatch<SetStateAction<string[] | undefined>>;
  setSelectedSubjects: any;
  flag: boolean;
  setFlag: Dispatch<SetStateAction<boolean>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<filtersType>({
    experience: "",
    teachingStyle: [],
    verification: "",
    lang: "",
    gender: "",
    time: "",
    curriculam: [],
    rating: "",
    grade: [],
    location: "",
    latitude: "",
    longitude: "",
  }); // state to manage to different filters
  const [value, setValue] = React.useState<number[]>([5, 1000]); // state to store the price filter value
  const [time, setTime] = useState<{ startTime: string; endTime: string }>({
    startTime: "",
    endTime: "",
  });
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]); // state to store the selected subjects.
  const [flag, setFlag] = useState<boolean>(false);
  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        value,
        setValue,
        time,
        setTime,
        selectedSubjects,
        setSelectedSubjects,
        flag,
        setFlag,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
