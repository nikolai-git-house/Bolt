export const buildBotMessages = profile => {
  let botMessages = [];
  const { firstname, lastname, email } = profile;

  if (!email) {
    botMessages.push({
      type: "bot",
      text: `Hey ${firstname}, Nice to meet you.`,
      isUserNext: false
    });
    botMessages.push({
      type: "bot",
      text: `Your account currently isn't activated.`,
      isUserNext: false
    });
    botMessages.push({
      type: "bot",
      text: `To activate your account may I register your email please?`,
      key: "email",
      isUserNext: true
    });
    botMessages.push({
      type: "bot",
      text: `Please now set a password?`,
      key: "password",
      isUserNext: true
    });
    botMessages.push({
      type: "bot",
      text: `Please wait for me to activate your account.`,
      isFinish: true,
      isUserNext: false
    });
    botMessages.push({
      type: "bot",
      text: `Great! Your account is activated.`,
      isUserNext: false
    });
    botMessages.push({
      type: "bot",
      text: `How can I help you today?`,
      isUserNext: false
    });
    botMessages.push({
      type: "bot",
      isUserNext: true,
      isChoice: true,
      choiceselected: false
    });
  } else {
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
  }
  return botMessages;
};
