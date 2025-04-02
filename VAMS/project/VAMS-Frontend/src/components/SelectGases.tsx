import Select from 'react-select';

const options = [
    { value: 'H2S', label: 'H₂S' },
    { value: 'CO2', label: 'CO₂' },
    { value: 'SO2', label: 'SO₂' },
    { value: 'HCl', label: 'HCl' },
];

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        borderColor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
            borderColor: 'transparent',
        },
        backgroundColor: 'white',
        padding: '0.5rem',
        borderRadius: '0.375rem',
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: '#E5E7EB', // Tailwind's gray-200
        borderRadius: '0.375rem',
        padding: '0.25rem',
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: '#1F2937', // Tailwind's gray-800
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: '#6B7280', // Tailwind's gray-500
        '&:hover': {
            backgroundColor: '#D1D5DB', // Tailwind's gray-300
            color: '#1F2937', // Tailwind's gray-800
        },
    }),
};

interface SelectGasesProps {
    selectedGases: string[];
    setSelectedGases: (gases: string[]) => void;
}

export function SelectGases({ selectedGases, setSelectedGases }: SelectGasesProps) {
    const handleChange = (selectedOptions: any) => {
        const gases = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setSelectedGases(gases);
    };

    return (
       
            <Select
                isMulti
                name="gases"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Gas filters"
                styles={customStyles}
                value={options.filter(option => selectedGases.includes(option.value))}
                onChange={handleChange}
            />

    );
}