import "./Menu.css";
import Frame_14 from "../images/Frame_14.svg";
import Frame_15 from "../images/Frame_15.svg";
import Frame_17 from "../images/Frame_17.svg";
import Frame_18 from "../images/Frame_18.svg";
import Frame_19 from "../images/Frame_19.svg";
import Frame_20 from "../images/Frame_20.svg";
import Frame_22 from "../images/Frame_22.svg";
import Frame_23 from "../images/Frame_23.svg";

export default () => {
  return (
    <div className='Menu'>
      <div className='Logo-div'>
        <div className='Logo'>
          <img src={Frame_20} />
          <img src={Frame_22} />
          <img src={Frame_23} />
        </div>
        <div className='Logo'>
          <img src={Frame_17} />
          <img src={Frame_14} />
          <img src={Frame_15} />
        </div>
        <div className='Logo'>
          <img src={Frame_18} />
          <img src={Frame_19} />
        </div>
      </div>
      <div className='Menu-text'>
        <p>שאלון</p>
      </div>
    </div>
  );
};
