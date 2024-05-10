import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import styled from 'styled-components';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';

const StyledBox = styled(Box)`
  background-color: ${props => props.isRead ? '#FFFFFF' : '#F1F8FF'};
  padding: 1.5rem;
  border-left: ${props => props.isRead ? 'none' : '5px solid #1A73E8'};
  border-bottom: 1px solid #E0E0E0;
  width: 100%; /* Full width for mobile */
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #E8F0FE;
  }
`;

const StyledHeading = styled(Heading)`
  color: #202124;
  text-decoration: none;
`;

const StyledText = styled(Text)`
  color: #5F6368;
  text-decoration: none;
`;

const CenteredBox = styled(Flex)`
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const InboxPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const receiverId = userId;
        const response = await axios.get(`https://crud-for-inbox.onrender.com/api/receiver/${receiverId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleMessageClick = async (messageId) => {
    try {
      const formData = new FormData();
      formData.append('isRead', true);
  
      await axios.put(`https://crud-for-inbox.onrender.com/api/messages/${messageId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setMessages(prevMessages =>
        prevMessages.map(message => {
          if (message._id === messageId) {
            return { ...message, isRead: true };
          }
          return message;
        })
      );
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };
  

  return (
    <CenteredBox>
      <Box width={{ base: '90%', md: '70%', lg: '50%' }}> {/* Responsive width */}
        <Heading mb={6} textAlign="center">Inbox</Heading>
        {messages.map((message) => (
          <RouterLink key={message._id} to={`/message/${message._id}`} style={{ textDecoration: 'none' }}>
            <StyledBox isRead={message.isRead} onClick={() => handleMessageClick(message._id)}>
              <StyledHeading size="md" mb={2}>
                {message.subject}
              </StyledHeading>
              <StyledText noOfLines={2}>{message.content}</StyledText>
            </StyledBox>
          </RouterLink>
        ))}
      </Box>
    </CenteredBox>
  );
};

export default InboxPage;
