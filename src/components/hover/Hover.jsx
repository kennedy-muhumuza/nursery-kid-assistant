import "@fortawesome/fontawesome-free/css/all.css";

import styles from "./Hover.module.css";
export const Hover = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["image"]}>
        <img src="img1.jpg" alt="" />
        <i className="fas fa-search fa-5x"></i>
      </div>
      <div className={styles["image"]}>
        <img src="img2.jpg" alt="" />
        <i className="fas fa-search fa-5x"></i>
      </div>
      <div className={styles["image"]}>
        <img src="img3.jpg" alt="" />
        <i className="fas fa-search fa-5x"></i>
      </div>
    </div>
  );
};
