
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage } from '@/services/chat/messageService';

interface UseChatBoxActionsProps {
  messageText: string;
  clearMessageText: () => void;
  setSending: (sending: boolean) => void;
  onSendMessage?: (content: string) => void;
  threadId?: string;
  currentUserId: string;
  currentUserName: string;
  recipientId: string;
  recipientName: string;
}

export function useChatBoxActions({
  messageText,
  clearMessageText,
  setSending,
  onSendMessage,
  threadId,
  currentUserId,
  currentUserName,
  recipientId,
  recipientName
}: UseChatBoxActionsProps) {
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast({
        title: "Can't send empty message",
        description: "Please type a message before sending",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      
      // If we're using the parent's onSendMessage
      if (onSendMessage) {
        onSendMessage(messageText);
        clearMessageText();
        return;
      }
      
      // Direct send if we have threadId
      if (threadId) {
        console.log(`Directly sending message in thread ${threadId}: ${messageText}`);
        
        // Send message
        const newMessage = await sendChatMessage(threadId, {
          senderId: currentUserId,
          senderName: currentUserName,
          receiverId: recipientId,
          content: messageText,
          timestamp: new Date().toISOString(),
          isRead: false
        });
        
        console.log('Message sent successfully via ChatBox:', newMessage);
        
        // Clear input
        clearMessageText();
        
        // Show toast
        toast({
          title: "Message Sent",
          description: `Your message to ${recipientName} was sent successfully.`,
        });
      } else {
        throw new Error("No thread ID available for sending message");
      }
    } catch (error) {
      console.error("Error sending message from ChatBox:", error);
      toast({
        title: "Message Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return {
    handleSendMessage
  };
}
