import "./legend.css";
const Legend = ({ text, color = "#fdfdfd", size, isOutline }) => {
  return (
    <div className='legend-div'>
      <span
        className='legend-circle1'
        style={{
          backgroundColor: color,
          height: size,
          width: size,
          border: `2px solid ${color !== "none" ? color : "#fdfdfd"}`,
        }}>
        {}
      </span>
      <p>{text}</p>
    </div>
  );
};

export default Legend;
