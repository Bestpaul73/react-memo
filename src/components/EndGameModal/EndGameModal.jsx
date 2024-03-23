import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useSelector } from "react-redux";
import { addLeader, getLeaders } from "../../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const [leader, setLeader] = useState("Player");
  const [playerLeader, setPlayerLeader] = useState(false);
  const fullGameTime = gameDurationSeconds + gameDurationMinutes * 60;
  const { level } = useSelector(state => state.game);

  let title = isWon ? "Вы победили!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  useEffect(() => {
    if (level === 3 && isWon) {
      getLeaders()
        .then(({ leaders }) => {
          console.log(leaders);
          // let leader = data.leaders;
          leaders = leaders.sort(function (a, b) {
            return a.time - b.time;
          });
          if (leaders[leaders.length - 1].time > fullGameTime || leaders.length < 10) {
            setPlayerLeader(true);
          }
        })
        .catch(() => {
          alert("Не получилось получить список лидеров");
        });
    }
  }, [fullGameTime, isWon, level]);

  const playerInLeaders = () => {
    if (!playerLeader) return;

    addLeader({
      name: leader,
      time: fullGameTime,
    })
      .then(newLeaders => {
        // console.log(newLeaders);
      })
      .catch(() => alert("Ошибка добавления пользователя"));
  };

  const resetGame = () => {
    if (level === 3) {
      playerInLeaders();
    }
    onClick();
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{playerLeader ? "Вы попали" : title}</h2>
      {playerLeader && (
        <>
          <h2 className={styles.title}>{" на Лидерборд!"}</h2>
          <input
            autoFocus
            type="text"
            className={styles.input}
            placeholder={"Player"}
            onChange={event => {
              setLeader(event.target.value);
            }}
          />
        </>
      )}

      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={resetGame}>Играть снова</Button>

      <Link
        className={styles.link}
        to="/leaderboard"
        onClick={() => {
          playerInLeaders();
        }}
      >
        Перейти к лидерборду
      </Link>
    </div>
  );
}
