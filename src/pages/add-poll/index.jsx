import React, { useState } from "react";
import {
  useCreate_PollMutation,
  useDelete_PollMutation,
  useGet_PollQuery,
} from "@/redux/poll/poll";
import { PrimaryBtn } from "@/components/Buttons/PrimaryBtn";
import { NotificationAlert } from "@/components/customAlerts/NotificationAlert";
import PollingOptions from "@/components/pollingOptions/PollingOptions";
import Body from "@/layout/Body";
import dynamic from "next/dynamic";
import style from "../../styles/poll.module.css";
import Cookies from "js-cookie";

const PollingPage = () => {
  const userData = JSON.parse(Cookies.get("userData"));
  const userID = userData?._id;
  const username = userData?.name;

  const [newOption, setNewOption] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [questionIsCreated, setQuestionIsCreated] = useState(false);
  const [pollOptions, setPollOptions] = useState([]);
  const [createdPoll, setCreatedPoll] = useState([]);

  const handleAddQuestion = () => {
    if (pollQuestion !== "") {
      setQuestionIsCreated(true);
    } else {
      NotificationAlert("Add Question First");
    }
  };

  const handleAddOptions = () => {
    if (newOption.trim() !== "") {
      if (pollOptions.length !== 5) {
        const op = {
          optionName: newOption,
        };
        setPollOptions([...pollOptions, op]);
        setNewOption("");
      } else {
        NotificationAlert("Can't Add More Than 5 Options");
      }
    } else {
      NotificationAlert("Add Options First");
    }
  };

  const createdPollHandler = () => {
    setCreatedPoll((prev) => [...prev, ...pollOptions]);
    handleCreatePoll();
    setPollQuestion("");
  };

  const [Create_poll] = useCreate_PollMutation();

  const handleCreatePoll = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("pollQuestion", pollQuestion);
    for (const options of pollOptions) {
      formData.append("pollOptions", options);
    }

    try {
      const res = await Create_poll({
        userID,
        data: {
          username: username,
          pollQuestion: pollQuestion,
          pollOptions: pollOptions,
        },
      });

      if (!res.error) {
        NotificationAlert("Poll created successfully", "success");
        setPollOptions([]);
      } else {
        NotificationAlert("Error creating poll");
      }
    } catch (error) {
      NotificationAlert("Error creating poll");
    }
  };

  const { data: getAllPoll } = useGet_PollQuery();

  // delete Poll
  const [delete_poll] = useDelete_PollMutation();

  const handleDeletePoll = async (pollID) => {
    try {
      const res = await delete_poll({
        pollID,
        userID,
      });
      if (!res.error) {
        NotificationAlert("Poll deleted successfully", "success");
      } else {
        NotificationAlert("Error deleting poll");
      }
    } catch (error) {
      NotificationAlert("Error deleting poll");
    }
  };

  return (
    <Body>
      <div className="flex items-center justify-center flex-col bg-gray-50 py-20">
        <div className="w-2/4 py-10 bg-white px-4 flex flex-col rounded-lg shadow-2xl ">
          {!questionIsCreated && (
            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Create Question"
                value={pollQuestion.question}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <button
                className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                onClick={handleAddQuestion}>
                Create Question
              </button>
            </div>
          )}
          {questionIsCreated && pollQuestion !== "" && (
            <div className="flex flex-col gap-1 border border-b-1 p-1 border-t-0 border-l-0 border-r-0 border-b-gray-400 mb-5">
              <>
                <h1 className="font-bold">Question</h1>
                <h2>{pollQuestion}</h2>
              </>
            </div>
          )}
          {questionIsCreated && (
            <div className="flex flex-col gap-5">
              <>
                <input
                  type="text"
                  placeholder="Add Options"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-dark py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                <button
                  onClick={handleAddOptions}
                  className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  Add Options
                </button>
              </>

              {createdPoll.length === 0 && pollOptions?.length > 0 && (
                <div>
                  <h2 className="font-bold mb-5">Option List</h2>
                  <ul className="border border-black p-5 rounded">
                    {pollOptions.map((option, index) => (
                      <li
                        key={index}
                        className="border border-t-gray-600 border-r-0 border-l-0 border-b-0 pt-2 pb-2">
                        Option #{index + 1} ({option.optionName})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pollOptions.length > 0 && (
                <button
                  className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={createdPollHandler}>
                  Create Poll
                </button>
              )}
            </div>
          )}
        </div>
        <div className={` ${style.polls} px-4`}>
          {getAllPoll?.map((poll, index) => (
            <div
              className="w-72 rounded p-4 bg-white h-full flex justify-evenly flex-col"
              key={index}>
              <div className="flex flex-col gap-1 border border-b-1 p-1 border-t-0 border-l-0 border-r-0 border-b-gray-400 mb-5">
                <div className="flex justify-between items-center flex-row-reverse">
                  <h2 className="w-full break-all">{poll.pollQuestion}</h2>
                </div>
              </div>
              <h1 className="font-bold mb-2">Options</h1>
              <div className="flex gap-3 flex-col">
                {poll?.pollOptions?.map((option, optionIndex) => (
                  <PollingOptions
                    key={optionIndex}
                    optionID={option._id}
                    optionName={option.optionName}
                    AnswerArr={option?.pollAns}
                    question={poll.pollQuestion}
                    pollID={poll._id}
                  />
                ))}
                {poll?.userID === userID && (
                  <PrimaryBtn
                    name={"Delete Poll"}
                    onClick={() => handleDeletePoll(poll._id)}
                    className={
                      "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Body>
  );
};

export default dynamic(() => Promise.resolve(PollingPage), { ssr: false });
