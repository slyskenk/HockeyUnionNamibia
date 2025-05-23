import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { db } from '../../firebase/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const animateDot = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={styles.typingIndicator}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View key={index} style={[styles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
};

const CommunityForumScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timeout;
    if (typing) {
      timeout = setTimeout(() => setTyping(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [typing]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    if (!user) {
      alert('You must be logged in to send a message.');
      return;
    }

    await addDoc(collection(db, 'messages'), {
      text: newMessage.trim(),
      user: user.displayName || 'Anonymous',
      profilePic: user.photoURL || 'https://i.pravatar.cc/150?img=3',
      uid: user.uid,
      likes: 0,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
    setTyping(false);
    Keyboard.dismiss();
  };

  const handleLike = async (id) => {
    const msgRef = doc(db, 'messages', id);
    await updateDoc(msgRef, {
      likes: increment(1),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={() => setTyping(false)}
        renderItem={({ item }) => {
          const isOwnMessage = user && item.uid === user.uid;
          return (
            <View
              style={[
                styles.messageBox,
                isOwnMessage ? styles.myMessageBox : styles.otherMessageBox,
              ]}
            >
              {!isOwnMessage && (
                <Image source={{ uri: item.profilePic }} style={styles.avatar} />
              )}
              <View
                style={[
                  styles.messageContent,
                  isOwnMessage ? styles.myMessageContent : null,
                ]}
              >
                {!isOwnMessage && <Text style={styles.username}>{item.user}</Text>}

                <Text
                  style={[
                    styles.messageText,
                    isOwnMessage ? styles.myMessageText : null,
                  ]}
                >
                  {item.text}
                </Text>

                {/* Timestamp */}
                <Text style={styles.timestamp}>
                  {item.timestamp?.toDate
                    ? new Date(item.timestamp.toDate()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </Text>

                <TouchableOpacity
                  onPress={() => handleLike(item.id)}
                  style={[
                    styles.likeRow,
                    isOwnMessage ? { justifyContent: 'flex-end' } : null,
                  ]}
                >
                  <AntDesign
                    name="hearto"
                    size={16}
                    color={isOwnMessage ? '#1E40AF' : '#2563EB'}
                  />
                  <Text style={styles.likes}>{item.likes}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {typing && <TypingIndicator />}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          placeholder="Type a message..."
          onChangeText={(text) => {
            setNewMessage(text);
            setTyping(true);
          }}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommunityForumScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  messageList: {
    padding: 16,
    paddingBottom: 100,
  },
  messageBox: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  myMessageBox: {
    alignSelf: 'flex-end',
    backgroundColor: '#93C5FD',
    flexDirection: 'row-reverse',
  },
  otherMessageBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  myMessageContent: {
    alignItems: 'flex-end',
  },
  username: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  messageText: {
    color: '#1E40AF',
    marginTop: 4,
  },
  myMessageText: {
    textAlign: 'right',
    color: '#1E3A8A',
  },
  timestamp: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  likes: {
    marginLeft: 6,
    color: '#2563EB',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
    marginHorizontal: 3,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#BFDBFE',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
  },
});
