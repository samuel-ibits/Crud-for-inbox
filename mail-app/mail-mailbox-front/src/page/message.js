import React, { useState, useEffect, useRef } from 'react';
import { Flex, Heading, Text, Input, Button } from '@chakra-ui/react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StyledBox = styled.div`
  background-color: #FAFAFA; /* Light gray background */
  padding: 1.5rem; /* Padding around the box */
  border-radius: 8px; /* Rounded corners */
  margin-bottom: 1rem; /* Margin between messages */
  max-width: 400px; /* Max width for the message box */
  position: relative; /* Relative positioning */
`;


const MessageContent = styled(Text)`
  color: #262626; /* Dark gray */
`;

const ReceiverBox = styled(StyledBox)`
  background-color: #0095f6; /* Light blue for receiver messages */
  align-self: flex-start; /* Align to the left */
`;

const SenderBox = styled(StyledBox)`
  background-color: #FFFFFF; /* White for sender messages */
  align-self: flex-end; /* Align to the right */
`;

const MessageDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #CCCCCC; /* Light gray */
  margin: 1rem 0; /* Margin above and below */
`;

const StyledInput = styled(Input)`
  border-radius: 9999px; /* Rounded border */
  border: 1px solid #DBDBDB; /* Light gray border */
  padding: 0.5rem 1rem; /* Padding inside input */
  margin-right: 1rem; /* Margin to separate from button */
`;

const StyledButton = styled(Button)`
  border-radius: 9999px; /* Rounded border */
  padding: 0.5rem 1.5rem; /* Padding inside button */
`;

const Message = () => {
  const { id: messageId } = useParams(); // Destructure messageId from URL parameters
  const currentUser = '6630aa0827925b6d3e42f2ae'; // Replace with actual current user ID
  const [conversation, setConversation] = useState({ conversation: [] });
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch conversation data from the API
    fetch(`https://crud-for-inbox.onrender.com/api/messages/${messageId}`) // Use messageId in the API URL
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming the API returns an array of conversations
        if (Array.isArray(data)) {
          // Extract the conversation from the first element of the array
          const conversation = data[0].conversation;
          setConversation({ conversation });
        } else {
          console.error('Unexpected data format');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [messageId]); // Add messageId to the dependency array

  useEffect(() => {
    // Scroll to the bottom of the message list whenever the conversation updates
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const formData = new FormData();
        formData.append('message', newMessage);
        formData.append('sender', currentUser);
  
        const response = await axios.post(`https://crud-for-inbox.onrender.com/api/messages/${messageId}/send`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
          }
        });
  
        // Assuming the API returns the updated conversation
        const updatedConversation = response.data;
  
        // Update the conversation state with the updated conversation
        setConversation(updatedConversation);
  
        // Clear the input field after sending the message
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  

  return (
    <Flex justify="center" align="center" minH="100vh" p={5}>
      <Flex direction="column" alignItems="center" w="100%" maxW="600px">
        <Heading mb={6} textAlign="center" color="#262626">Direct Messages</Heading>
        <Flex direction="column" w="100%" overflowY="auto">
          {conversation.conversation && conversation.conversation.map((message, index) => (
            <React.Fragment key={index}>
              {message.sender === currentUser ? (
                <SenderBox>
                  <MessageContent>{message.message}</MessageContent>
                </SenderBox>
              ) : (
                <ReceiverBox>
                  <MessageContent>{message.message}</MessageContent>
                </ReceiverBox>
              )}
              <MessageDivider />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </Flex>
        <Flex mt={4} w="100%">
          <StyledInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            size="md"
            variant="filled"
            flex={1}
          />
          <StyledButton onClick={handleSendMessage} colorScheme="blue" size="md">
            Send
          </StyledButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Message;
