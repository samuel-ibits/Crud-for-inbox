import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import "./style.css";

// Styled components
const StyledBox = styled(Box)`
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled(Text)`
  text-align: center;
`;

const WelcomeHeading = styled(Heading)`
  margin-bottom: 4;
`;

const MessageText = styled(Text)`
  margin-bottom: 1;
`;

// HomePage component
const HomePage = ({ userId }) => {
  const [user, setUser] = useState(null);

  // Fetch user data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://crud-for-inbox.onrender.com/api/users/${userId}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [userId]);

  // Loading state
  if (!user) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <LoadingText>Loading...</LoadingText>
      </Flex>
    );
  }

  // Destructure user data
  const { name, unreadMessages, totalMessages } = user;

  // Message count text
  const messageCountText = `${totalMessages} message${
    totalMessages !== 1 ? "s" : ""
  }, ${unreadMessages} unread.`;

  return (
    <Flex justify="center" align="center" minH="100vh">
      <StyledBox>
        <WelcomeHeading>Welcome, {name}!</WelcomeHeading>
        <MessageText>{messageCountText}</MessageText>
        <RouterLink to={`/inbox/${userId}`}>
          <Button className="customButton">View Messages</Button>
        </RouterLink>
      </StyledBox>
    </Flex>
  );
};

export default HomePage;
