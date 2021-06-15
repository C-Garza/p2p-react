import {useState, useEffect, useRef} from "react";
import { cycledWordsList } from "../../data/homeHeader";
import {v4 as uuidv4} from "uuid";
import styles from "./HomeHeader.module.css";

const HomeHeader = ({mainHeader, subHeader, cycle}) => {
  const [count, setCount] = useState(0);
  const [cycledWord, setCycledWord] = useState(cycledWordsList.length ? cycledWordsList[count] : "");
  const cycledRef = useRef(null);

  useEffect(() => {
    if(!cycle && !cycledWordsList[count + 1]) return;
    const cycledRefValue = cycledRef.current;
    const handleCycle = () => {
      if(!cycledWordsList[count + 1]) return;
      setCycledWord(cycledWordsList[count + 1]);
      setCount(count + 1);
    };
    if(cycledRefValue && cycledWord) {
      cycledRefValue.addEventListener("animationend", handleCycle);
    }
    return () => {
      if(cycledRefValue && cycledWord) {
        cycledRefValue.removeEventListener("animationend", handleCycle);
      }
    };
  }, [cycledWord, cycle, count]);

  const renderCycledWord = () => {
    if(!cycle) return "";
    if(!cycledWordsList[count + 1]) {
      return <span key={uuidv4()} ref={cycledRef} className={`${styles.cycled__word} ${styles["cycled__word--stop"]}`}>{cycledWord}</span>;
    }
    return <span key={uuidv4()} ref={cycledRef} className={styles.cycled__word}>{cycledWord}</span>;
  };

  return(
    <div className={styles.container}>
      <h1 className={styles.main__header}>{mainHeader}</h1>
      <h2 className={styles.sub__header}>{subHeader} {renderCycledWord()}</h2>
    </div>
  );
};

export default HomeHeader;