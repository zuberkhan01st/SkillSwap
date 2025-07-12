
// Simple UUID generator alternative
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export interface MeetingDetails {
  meetingId: string;
  meetingLink: string;
  joinLink: string;
  password?: string;
}


export const generateMeeting = async (
  title: string,
  scheduledDate: Date,
  duration: number = 60
): Promise<MeetingDetails> => {
  try {
    // Generate unique meeting room name for Jit.si
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const meetingId = `skillswap-${timestamp}-${randomStr}`;
    
    // Create Jit.si meeting room URL
    // Jit.si allows any room name, rooms are created instantly when accessed
    const meetingLink = `https://meet.jit.si/${meetingId}`;
    const joinLink = `${meetingLink}#config.startWithAudioMuted=true&config.startWithVideoMuted=false`;
    
    // Add meeting title and participants info to URL
    const encodedTitle = encodeURIComponent(title);
    const meetingLinkWithTitle = `${meetingLink}#config.roomPassword=&config.subject=${encodedTitle}`;

    return {
      meetingId,
      meetingLink: meetingLinkWithTitle,
      joinLink,
      password: undefined // Jit.si doesn't require password by default
    };
  } catch (error) {
    console.error('Error generating Jit.si meeting:', error);
    throw new Error('Failed to generate meeting link');
  }
};

export const generateZoomMeeting = async (
  title: string,
  scheduledDate: Date,
  duration: number = 60
): Promise<MeetingDetails> => {

  
  // Placeholder implementation
  return generateMeeting(title, scheduledDate, duration);
};

// For Google Meet integration
export const generateGoogleMeetMeeting = async (
  title: string,
  scheduledDate: Date,
  duration: number = 60
): Promise<MeetingDetails> => {
  
  return generateMeeting(title, scheduledDate, duration);
};

export default {
  generateMeeting,
  generateZoomMeeting,
  generateGoogleMeetMeeting
};
