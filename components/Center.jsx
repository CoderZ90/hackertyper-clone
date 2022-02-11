import { useEffect, useRef, useState } from "react";
import Message from "./Message";

const CHARS_PER_STROKE = 2;

const Center = () => {
  const [sourceCode, setSourceCode] = useState("");
  const [content, setContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [messageType, setMessageType] = useState("denied");
  const [isLocked, setIsLocked] = useState(false);

  const containerRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    containerRef.current.focus();

    fetch("code.txt")
      .then((res) => res.text())
      .then((text) => setSourceCode(text));
  }, []);

  const handleKeyDown = (e) => {
    if (e.key !== "Control") {
      runScript();
    } else {
      removeMessage();
    }
  };

  const removeMessage = () => {
    setIsLocked(false);
  };

  const runScript = () => {
    if (isLocked) return;

    setCurrentIndex(currentIndex + CHARS_PER_STROKE);
    setContent(sourceCode.substring(0, currentIndex));

    paragraphRef.current.scrollIntoView();

    if (currentIndex !== 0 && currentIndex % 300 === 0) {
      setIsLocked(true);
      setMessageType("denied");
    }
    if (currentIndex !== 0 && currentIndex % 900 === 0) {
      setIsLocked(true);
      setMessageType("success");
    }

    console.log("run message...");
  };

  return (
    <>
      <div
        id="container"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={containerRef}
      >
        <div id="source">{content}</div>

        {/* autoscroll fix */}
        <p ref={paragraphRef}></p>
      </div>

      {isLocked && <Message type={messageType} />}
    </>
  );
};

export default Center;
