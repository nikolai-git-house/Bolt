export const buildBotMessages = profile => {
  let botMessages = [];
  const { firstname } = profile;

  botMessages.push({
    type: "bot",
    text: `Hey ${firstname}, How can I help you today?`,
    isUserNext: false
  });
  botMessages.push({
    type: "bot",
    isUserNext: true,
    isChoice: true,
    choiceselected: false
  });
  return botMessages;
};
