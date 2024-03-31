import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useSelector } from "react-redux";
import eye from "./images/eye.svg";
import pair from "./images/pair.svg";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";
// Пауза во время суперсилы
const STATUS_PAUSE = "STATUS_PAUSE";

let pauseTimerOn = false;

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000) - pauseTimerOn * 5;
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  //Массив открытых непарных карт
  const [openCardsWithoutPair, setOpenCardsWithoutPair] = useState([]);

  //Счетчик ошибок
  const [leftAttempts, setLeftAttempts] = useState(3);
  //Режим сложности из стора
  const { difficultyMode } = useSelector(state => state.game);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  //Стейт для прозрения
  const [epiphanyUsed, setEpiphanyUsed] = useState(false);
  //Стейт для алохоморы
  const [alohomoraUsed, setAlohomoraUsed] = useState(false);
  //Стейт ачивок
  const [achievements, setAchievements] = useState([1, 2]);

  // useEffect(() => {
  //   console.log(achievements);
  // }, [achievements]);

  //Убирает ачивку при легком режиме
  useEffect(() => {
    if (difficultyMode) {
      setAchievements([2]);
    }
  }, [difficultyMode]);

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    pauseTimerOn = false;

    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    pauseTimerOn = false;

    setEpiphanyUsed(false);
    setAlohomoraUsed(false);
    if (difficultyMode) {
      setAchievements([2]);
    } else {
      setAchievements([1, 2]);
    }
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setLeftAttempts(3);
  }

  const checkAllCardsOpen = cards => {
    const isPlayerWon = cards.every(card => card.open);
    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }
  };

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    if (openCardsWithoutPair.length >= 2) {
      return;
    }

    // Если карта уже открыта, то ничего не делаем.
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    let nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);
    checkAllCardsOpen(nextCards);

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPairTemp = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });
    setOpenCardsWithoutPair(openCardsWithoutPairTemp);

    const playerLost = openCardsWithoutPairTemp.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      console.log(leftAttempts);
      setLeftAttempts(leftAttempts - 1);
      if (leftAttempts <= 1 || !difficultyMode) {
        finishGame(STATUS_LOST);
        setOpenCardsWithoutPair([]);
      } else {
        setTimeout(() => {
          setCards(cards.map(card => (openCardsWithoutPairTemp.includes(card) ? { ...card, open: false } : card)));
          setOpenCardsWithoutPair([]);
        }, 1000);
      }

      return;
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    if (status !== STATUS_PAUSE) {
      const intervalId = setInterval(() => {
        setTimer(getTimerValue(gameStartDate, gameEndDate));
      }, 100);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [gameStartDate, gameEndDate, status]);

  const openAllCards = () => {
    if (epiphanyUsed) {
      return;
    }
    pauseTimerOn = true;

    setAchievements(achievements.filter(achievement => achievement !== 2));
    setStatus(STATUS_PAUSE);
    setEpiphanyUsed(true);
    const closedCards = cards.filter(card => !card.open);
    // console.log(closedCards);
    setTimeout(() => {
      setCards(
        cards.map(card => {
          if (closedCards.includes(card)) {
            return { ...card, open: false };
          } else {
            return card;
          }
        }),
      );
      setStatus(STATUS_IN_PROGRESS);
    }, 5000);
  };

  const openRandomPair = () => {
    if (alohomoraUsed) {
      return;
    }
    if (status === STATUS_PAUSE) {
      return;
    }
    setAchievements(achievements.filter(achievement => achievement !== 2));
    setAlohomoraUsed(true);
    const closedCards = cards.filter(card => !card.open);
    const randomCard = closedCards[Math.floor(Math.random() * closedCards.length)];
    const pairsCard = closedCards.filter(
      closedCard =>
        closedCard.suit === randomCard.suit && closedCard.rank === randomCard.rank && randomCard.id !== closedCard.id,
    );
    let nextCards = cards.map(card => {
      if (card === randomCard || card === pairsCard[0]) {
        return { ...card, open: true };
      } else {
        return card;
      }
    });
    setCards(nextCards);
    checkAllCardsOpen(nextCards);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>

        {status === STATUS_PREVIEW ? null : (
          <div className={styles.epiphany_buttons}>
            <button
              className={styles.epiphany_button}
              onClick={() => {
                openAllCards();
              }}
            >
              <img src={eye} alt="" className={styles.epiphany_button_img} />
              {epiphanyUsed ? (
                <div className={styles.epiphany_button_used}></div>
              ) : (
                <div className={styles.epiphany_button_clue}>
                  <img src={eye} alt="" className={styles.epiphany_button_clue_img} />
                  <div>
                    <h3 className={styles.epiphany_button_clueTitle}>Прозрение</h3>
                    <p className={styles.epiphany_button_clueText}>
                      На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.
                    </p>
                  </div>
                </div>
              )}
            </button>

            <button
              className={styles.alohomora_button}
              onClick={() => {
                openRandomPair();
              }}
            >
              <img src={pair} alt="" className={styles.alohomora_button_img} />
              {alohomoraUsed ? (
                <div className={styles.alohomora_button_used}></div>
              ) : (
                <div className={styles.alohomora_button_clue}>
                  <div className={styles.alohomora_button_clue_b}>
                    <img src={pair} alt="" className={styles.alohomora_button_clue_img} />
                  </div>
                  <div>
                    <h3 className={styles.alohomora_button_clueTitle}>Алохомора</h3>
                    <p className={styles.alohomora_button_clueText}>Открыть случайную пару карт.</p>
                  </div>
                </div>
              )}
            </button>
          </div>
        )}

        {(status === STATUS_IN_PROGRESS || status === STATUS_PAUSE) && (
          <Button onClick={resetGame}>Начать заново</Button>
        )}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {difficultyMode ? <div className={styles.leftAttempts}>Осталось {leftAttempts} попытки</div> : ""}

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            achievements={achievements}
          />
        </div>
      ) : null}
    </div>
  );
}
