const Spinner = ({ size = 25, thickness = 4 }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `${thickness}px solid rgba(255, 255, 255, 0.3)`,
    borderTop: `${thickness}px solid green`,
  };

  return <div className="spinner" style={spinnerStyle}></div>;
};

export default Spinner;
