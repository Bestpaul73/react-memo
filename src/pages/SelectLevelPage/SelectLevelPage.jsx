import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./SelectLevelPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setLevel, toggleDifficultyModeReducer } from "../../store/gameSlice";

export function SelectLevelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const LEVELS = [1, 2, 3];
  const { level, difficultyMode } = useSelector(state => state.game);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          {LEVELS.map(item => {
            return (
              <li className={`${styles.level} ${LEVELS[item - 1] === level && styles.selected}`} key={item}>
                <button className={styles.levelLink} onClick={() => dispatch(setLevel(item))}>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>

        <label className={styles.subtitle}>
          <input
            type="checkbox"
            name="attempts"
            className={styles.input}
            onChange={() => dispatch(toggleDifficultyModeReducer())}
            defaultChecked={difficultyMode}
          />
          Cчетчик попыток
        </label>

        <Button
          onClick={() => {
            navigate(`/game/${level * 3}`);
          }}
        >
          Начать игру
        </Button>
        <Link className={styles.link} to="/leaderboard">
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
