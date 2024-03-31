import React, { useEffect } from "react";
import styles from "./LeaderboardPage.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getLeaders } from "../../api";
// import pazl from "./images/pazl.svg";
// import pazlSer from "./images/pazlSer.svg";
// import superpowers from "./images/superpowers.svg";
// import superpowersSer from "./images/superpowersSer.svg";
// import hoverSuperpowers from "./images/hoverSuperpowers.svg";
// import hoverPazl from "./images/hoverPazl.svg";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState(null);
  const [loading, setLoading] = useState("Данные загружаются");
  useEffect(() => {
    getLeaders()
      .then(data => {
        let leader = data.leaders;
        leader = leader.sort(function (a, b) {
          return a.time - b.time;
        });
        leader = leader.slice(0, 10);
        setLeaders(leader);
      })
      .catch(() => {
        setLoading("Упс... Не получилась найти лидеров, попробуйте позже -_-");
      });
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Лидерборд</h1>
        <Link to="/" className={styles.link}>
          <p className={styles.link_text}>Начать игру</p>
        </Link>
      </div>
      <ul className={styles.leaderboard}>
        <li className={styles.leaderboardTitle}>
          <div className={styles.leaderPosition}>Позиция</div>
          <div className={styles.leaderBlock}>
            <div>Пользователь</div>
            {/* <div>Достижения</div> */}
            <div>Время</div>
          </div>
        </li>
        {!leaders ? (
          <div className={styles.loader}>{loading}</div>
        ) : (
          leaders.map((leader, index) => (
            <li className={styles.leaders} key={leader.id}>
              <div className={styles.leaderPosition}>#{index + 1}</div>
              <div className={styles.leaderBlock}>
                <div className={styles.leaderBlock_name}>{leader.name}</div>
                {/* <div className={styles.leaderBlock_achievements}>
                  {leader.achievements && (
                    <div className={styles.leaderBlock_pazl}>
                      {leader.achievements.includes(1) ? (
                        <img src={pazl} alt="" className={styles.leaderBlock_img} />
                      ) : (
                        <img src={pazlSer} alt="" className={styles.leaderBlock_img} />
                      )}
                      {leader.achievements.includes(1) && (
                        <div className={styles.bubble_pazl}>
                          <img src={hoverPazl} alt="" className={styles.leaderBlock_hoverPazl} />
                          <p className={styles.leaderBlock_pazl_text}>Игра пройдена в сложном режиме</p>
                        </div>
                      )}
                    </div>
                  )}
                  {leader.achievements && (
                    <div className={styles.leaderBlock_superpowers}>
                      {leader.achievements.includes(2) ? (
                        <img src={superpowers} alt="" className={styles.leaderBlock_img} />
                      ) : (
                        <img src={superpowersSer} alt="" className={styles.leaderBlock_img} />
                      )}
                      {leader.achievements.includes(2) && (
                        <div className={styles.bubble_superpowers}>
                          <img src={hoverSuperpowers} alt="" className={styles.leaderBlock_hoverSuperpowers} />
                          <p className={styles.leaderBlock_superpowers_text}>Игра пройдена без супер-сил</p>
                        </div>
                      )}
                    </div>
                  )}
                </div> */}
                <div>{leader.time}</div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
