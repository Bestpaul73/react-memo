import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useEffect, useState } from "react";

export function SelectLevelPage() {
  const [attemptsFlag, setAttemptsFlag] = useState(false);

  useEffect(() => {
    console.log(attemptsFlag);
    localStorage.setItem("attemptsFlag", attemptsFlag);
  }, [attemptsFlag]);

  const toggleAttemptsFlag = () => {
    setAttemptsFlag(!attemptsFlag);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        {/* <h2 className={styles.subtitle}>Включить счетчик попыток</h2> */}

        <label className={styles.subtitle}>
          <input type="checkbox" name="attempts" className={styles.input} onChange={toggleAttemptsFlag} />
          {/* <span class={styles.customCheckbox}></span> */}
          Cчетчик попыток
        </label>
      </div>
    </div>
  );
}
