import { usePost_AnsMutation } from "@/redux/poll/poll";
import React from "react";
import { NotificationAlert } from "../customAlerts/NotificationAlert";
import Cookie from "js-cookie";

const PollingOptions = ({
  optionName,
  optionID,
  AnswerArr,
  question,
  pollID,
}) => {
  const userData = JSON.parse(Cookie.get("userData"));
  const userID = userData?._id;
  const username = userData?.name;

  const ifUserPostedAns = AnswerArr.some(
    (answerArr) => answerArr.userID === userID
  );

  const [poll_ans] = usePost_AnsMutation();

  const handlePollAns = async ({ optionName }) => {
    try {
      if (
        pollID !== "" &&
        userID !== "" &&
        optionID !== "" &&
        optionName !== ""
      ) {
        const res = await poll_ans({
          pollID: pollID,
          userID: userID,
          optionID: optionID,
          data: {
            pollName: optionName,
            username: username,
          },
        });
        if (!res.error) {
          NotificationAlert("Answer Posted Successfully", "success");
        } else {
          NotificationAlert("Error posting poll answer");
        }
      } else {
        NotificationAlert("Select Option First");
      }
    } catch (error) {
      NotificationAlert("Error posting poll answer");
    }
  };

  return (
    <div className="flex items-center me-4">
      <input
        type="radio"
        id={optionID}
        name={question}
        value={optionID}
        className="hidden peer"
        onChange={() => handlePollAns(optionName)}
        required
        defaultChecked={ifUserPostedAns}
      />
      <label
        htmlFor={optionID}
        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-white dark:border-gray-700 dark:peer-checked:text-blue-700 peer-checked:border-blue-700 peer-checked:text-blue-600 hover:text-white hover:bg-blue-400 dark:text-gray-400 dark:bg-white dark:hover:bg-blue-700 peer-checked:bg-blue-100">
        <div className="block">
          <div
            className="w-full text-lg font-semibold"
            style={{ wordBreak: "break-word" }}>
            {optionName}
          </div>
        </div>
        <div className="block">
          <div className="text-sm w-max">{AnswerArr?.length} votes</div>
        </div>
      </label>
    </div>
  );
};

export default PollingOptions;
