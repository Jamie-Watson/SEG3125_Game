const GenerationTypeSelector = ({ selectedType, onTypeChange }) => {
  const types = [
    { value: 'Random Puzzle', label: 'Random Puzzle' },
    { value: 'Upload Image', label: 'Upload Image' }
  ];

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">Generation Type</label>
      <p className="text-muted small mb-2">
        Method to create and find a solution to the nonogram game based on the chosen difficulty.
      </p>
      
      <select 
        className="form-select"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        {types.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenerationTypeSelector;