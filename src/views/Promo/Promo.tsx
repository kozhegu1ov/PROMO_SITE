import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CheckBoxOnIcon } from "../../assets/icons/checkbox_on.svg";
import { ReactComponent as CheckBoxOffIcon } from "../../assets/icons/checkbox_off.svg";
import closeXWhite from "../../assets/icons/closeX_white.svg";
import closeXBlack from "../../assets/icons/closeX_black.svg";
import styles from "./Promo.module.scss";
import axios from "axios";

const Promo: FC = () => {
  const navigate = useNavigate();

  const [isAgree, setIsAgree] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{ symbol: string }>({
    symbol: "5",
  });
  const [keyPress, setKeyPress] = useState<KeyboardEvent | { key: string }>({
    key: "_",
  });
  const [phoneNumber, setPhoneNumber] = useState<string[]>([
    "+",
    "7",
    "( ",
    "_",
    " ",
    "_",
    " ",
    "_",
    " )",
    "_",
    " ",
    "_",
    " ",
    "_",
    "-",
    "_",
    " ",
    "_",
    "-",
    "_",
    " ",
    "_",
  ]);
  const [timerSeconds, setTimerSeconds] = useState(10);
  const [isCheckValidation, setIsCheckValidation] = useState(false);
  const [isApplication, setApplication] = useState(false);

  const selectedElementRef = useRef(selectedElement);
  const prevSelectedElement = selectedElementRef.current;

  useEffect(() => {
    const arr = phoneNumber;
    setTimerSeconds(10);

    if (keyPress.key === "Agree") {
      setIsAgree(!isAgree);
    } else if (keyPress.key === "Confirm") {
      handleSubmitPhoneNumber();
      setSelectedElement({ symbol: "Confirm" });
    } else if (!isNaN(+keyPress.key) && keyPress.key !== " ") {
      const index = arr.indexOf("_");
      arr[index] = keyPress.key;

      setPhoneNumber([...arr]);
      setSelectedElement({ symbol: keyPress.key });
    } else if (keyPress.key === "Backspace") {
      //@ts-ignore
      const index = arr.findLastIndex(
        (item: string) => !isNaN(+item) && item !== " "
      );
      if (index !== 1) {
        arr[index] = "_";
        setPhoneNumber([...arr]);
      }
      setSelectedElement({ symbol: "Backspace" });
    } else if (keyPress.key === "Escape") {
      setSelectedElement({ symbol: "Escape" });
      navigate("/");
    } else {
      const arrangementElements = [
        ["1", "2", "3", "Escape"],
        ["4", "5", "6", "Escape"],
        ["7", "8", "9", "Escape"],
        ["Backspace", "0", "0", "Escape"],
        ["Agree", "Agree", "Agree", "Escape"],
        ["Confirm", "Confirm", "Confirm", "Escape"],
      ];

      let currentIndexes: string = "";

      outer: for (let i = 0; i < arrangementElements.length; i++) {
        for (let j = 0; j < arrangementElements[i].length; j++) {
          if (arrangementElements[i][j] === prevSelectedElement.symbol) {
            currentIndexes = i + "" + j;
            break outer;
          }
        }
      }

      switch (keyPress?.key) {
        case "ArrowUp":
          setSelectedElement({
            symbol:
              arrangementElements?.[+currentIndexes[0] - 1]?.[
                +currentIndexes[1]
              ] ?? arrangementElements[+currentIndexes[0]][+currentIndexes[1]],
          });
          break;
        case "ArrowDown":
          setSelectedElement({
            symbol:
              arrangementElements?.[+currentIndexes[0] + 1]?.[
                +currentIndexes[1]
              ] ?? arrangementElements[+currentIndexes[0]][+currentIndexes[1]],
          });
          break;
        case "ArrowRight":
          setSelectedElement({
            symbol:
              arrangementElements?.[+currentIndexes[0]]?.[
                +currentIndexes[1] + 1
              ] ?? arrangementElements[+currentIndexes[0]][+currentIndexes[1]],
          });
          break;
        case "ArrowLeft":
          setSelectedElement({
            symbol:
              arrangementElements?.[+currentIndexes[0]]?.[
                +currentIndexes[1] - 1
              ] ?? arrangementElements[+currentIndexes[0]][+currentIndexes[1]],
          });
          break;
      }
    }
  }, [keyPress]);

  //user inactivity timer
  useEffect(() => {
    const countdown = setInterval(() => {
      if (timerSeconds > 0) {
        setTimerSeconds(timerSeconds - 1);
      } else {
        clearInterval(countdown);
        navigate("/")
      }
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [timerSeconds]);

  // keyboard click feedback
  const handleKeyPress = (e: KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
    setKeyPress(e);
  };

  //for actual selectedElement
  if (keyPress.key === "Enter") {
    setKeyPress({ key: selectedElement.symbol });
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    selectedElementRef.current = selectedElement;
  });

  const checkSelectedElementClassName = (symbol: string): string =>
    selectedElement.symbol === symbol ? styles.aside_elementSelected : "";

  //click handlers for all action buttons except confirm
  const handleClick = (key: string) => {
    setKeyPress({ key });
  };

  //mock submit
  const handleSubmitPhoneNumber = () => {
    const arrNumber = phoneNumber.filter(
      (item: string) => !isNaN(+item) && item !== " "
    );
    if (isAgree) {
      const url = `http://apilayer.net/api/validate?access_key=${
        process.env.REACT_APP_NUMVERIFY_API_KEY
      }&number=+${arrNumber.join("")}&country_code=&format=1`;

      axios
        .get(url)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            if (data.valid) {
              setApplication(true)
              setTimerSeconds(10000)
            } else {
              setIsCheckValidation(true);
            }
          }
        })
        .catch(() => {
          alert("Произошла ошибка при выполнении запроса");
        });
    }
  };

  return (
    <main className={`${styles.main} container`} onClick={() => handleKeyPress}>
      <aside className={styles.aside}>
        {isApplication ? (
          <div className={styles.aside_boxApplication}>
            <h2>ЗАЯВКА <br /> ПРИНЯТА</h2>
            <p>Держите телефон под рукой. Скоро с Вами свяжется наш менеджер. </p>
          </div>
        ) : (
          <>
            <h3 className={styles.aside_title}>
              Введите ваш номер
              <br />
              мобильного телефона
            </h3>
            <p
              className={`${styles.aside_phoneNumber} ${
                isCheckValidation ? styles.aside_validation : ""
              }`}
            >
              {phoneNumber}
            </p>
            <p className={styles.aside_subtitle}>
              и с Вами свяжется наш менеждер для <br /> дальнейшей консультации
            </p>
            <div className={styles.aside_boxBtns}>
              {Array.from({ length: 9 }, (_, index) => {
                return (
                  <button
                    className={`${
                      styles.aside_btnNumber
                    } ${checkSelectedElementClassName(String(index + 1))}`}
                    onClick={() => handleClick(String(index + 1))}
                    key={index}
                  >
                    {index + 1}
                  </button>
                );
              })}
              <button
                className={`${styles.aside_btnNumber} ${
                  styles.aside_btnNumber_backspace
                } ${checkSelectedElementClassName("Backspace")}`}
                onClick={() => handleClick("Backspace")}
              >
                Стереть
              </button>
              <button
                className={`${
                  styles.aside_btnNumber
                } ${checkSelectedElementClassName("0")}`}
                onClick={() => handleClick("0")}
              >
                0
              </button>
            </div>
            {isCheckValidation ? (
              <p className={styles.aside_validation}>Неверно введён номер</p>
            ) : (
              <div className={styles.aside_boxAgree}>
                {isAgree ? (
                  <CheckBoxOnIcon onClick={() => handleClick("Agree")} />
                ) : (
                  <CheckBoxOffIcon
                    className={`${checkSelectedElementClassName("Agree")}`}
                    onClick={() => handleClick("Agree")}
                  />
                )}
                <p onClick={() => setIsAgree(!isAgree)}>
                  Согласие на обработку <br /> персональных данных
                </p>
              </div>
            )}
            <button
              className={`${
                styles.aside_btnConfirm
              } ${checkSelectedElementClassName("Confirm")}`}
              onClick={handleSubmitPhoneNumber}
            >
              Подтвердить номер
            </button>
          </>
        )}
      </aside>
      <img
        src={
          checkSelectedElementClassName("Escape") ? closeXBlack : closeXWhite
        }
        className={`${styles.closeX_icon}`}
        onClick={() => handleClick("Escape")}
      />
    </main>
  );
};

export default Promo;
