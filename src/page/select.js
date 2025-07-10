import React, { useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

const Selectcomponent = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 mx-auto mt-5"
    >
      <Select
        options={options}
        value={selectedOption}
        onChange={setSelectedOption}
        placeholder="Select a framework..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "8px",
            border: "2px solid #4CAF50",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }),
        }}
      />
    </motion.div>
  );
};

export default Selectcomponent;
