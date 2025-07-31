// composables/useAudioCall.js
import { ref, onMounted, onBeforeUnmount, computed  } from 'vue';
import { io } from 'socket.io-client';


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI


export function useAudioCall(callId) {
  /* ------------------------------------------------------------------ */
  /* 🔌  Signalling socket -------------------------------------------- */
  const socket = io(API_BASE_URI)

  /* ------------------------------------------------------------------ */
  /* 🎙️  Local media -------------------------------------------------- */
  const localStream   = ref(null);        // mic stream
  const peers         = {};               // socket.id ➜ RTCPeerConnection
  const remoteTracks  = ref([]);          // { id, stream } array – drives <RemoteAudio>

  const rtcConfig = {                     // STUN only – add TURN in prod
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  /* ------------------------------------------------------------------ */
  /* 🏗️  Helpers ------------------------------------------------------ */
  function makePeer(remoteSocketId, isOfferer) {
    const pc = new RTCPeerConnection(rtcConfig);
    peers[remoteSocketId] = pc;

    // 1. push our mic
    localStream.value?.getTracks().forEach(t => pc.addTrack(t, localStream.value));

    // 2. handle inbound tracks
    pc.ontrack = ({ streams: [stream] }) => {
      // de-dup
      if (!remoteTracks.value.some(r => r.id === remoteSocketId)) {
        remoteTracks.value.push({ id: remoteSocketId, stream });
      }
    };

    // 3. send ICE
    pc.onicecandidate = e => {
      if (e.candidate) socket.emit('icecandidate', {
        to: remoteSocketId,
        candidate: e.candidate,
      });
    };

    // 4. create offer if needed
    if (isOfferer) {
      pc.createOffer()
        .then(o => pc.setLocalDescription(o))
        .then(() => socket.emit('offer', { to: remoteSocketId, offer: pc.localDescription }));
    }
  }

  /* ------------------------------------------------------------------ */
  /* 🚀  Mount life-cycle --------------------------------------------- */
  onMounted(async () => {
    // Ask for mic only once
    localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    // Join the room
    socket.emit('join-call', callId);

    /* ---- Signalling events ---- */
    socket.on('new-socket', id => makePeer(id, true));

    socket.on('recive-offer', async ({ from, offer }) => {
      makePeer(from, false);
      await peers[from].setRemoteDescription(offer);
      const answer = await peers[from].createAnswer();
      await peers[from].setLocalDescription(answer);
      socket.emit('answer', { to: from, answer });
    });

    socket.on('recive-answer', async ({ from, answer }) => {
      await peers[from]?.setRemoteDescription(answer);
    });

    socket.on('recive-icecandidate', ({ from, candidate }) => {
      peers[from]?.addIceCandidate(candidate);
    });

    // Remove audio & peer when someone leaves (optional, emit this on the server)
    socket.on('peer-left', id => {
      peers[id]?.close?.();
      delete peers[id];
      remoteTracks.value = remoteTracks.value.filter(t => t.id !== id);
    });
  });

  /* ------------------------------------------------------------------ */
  /* 🧹  Cleanup ------------------------------------------------------ */
  onBeforeUnmount(() => {
    // 1. close every RTCPeerConnection
    Object.values(peers).forEach(pc => pc.close());
    // 2. stop mic
    localStream.value?.getTracks().forEach(t => t.stop());
    // 3. leave room
    socket.disconnect();
  });





/* ────────────────────────────────────────────────────
   🔈  Media-control state
   ──────────────────────────────────────────────────── */
const isMuted     = ref(false);   // my mic
const remoteMuted = ref(false);   // everyone else

function toggleLocalMute () {
  isMuted.value = !isMuted.value;
  localStream.value?.getAudioTracks()
                  .forEach(t => t.enabled = !isMuted.value);
}

function toggleRemoteMute () {
  remoteMuted.value = !remoteMuted.value;
  // all <audio.remote> come from RemoteAudio.vue
  document.querySelectorAll('audio.remote')
          .forEach(a => a.muted = remoteMuted.value);
}

// how many peers are in the room (me + remote)
const participantCount = computed(() =>
  /* localStream.value ? 1 : 0 */ 1 + remoteTracks.value.length
);


  /* ------------------------------------------------------------------ */
  /* 🎁  Exposed state ------------------------------------------------ */


  return {
    localStream,
    remoteTracks,  
    /* controls */
    toggleLocalMute,
    toggleRemoteMute,
    isMuted,
    remoteMuted,
    participantCount,        //  used by <RemoteAudio v-for>
  };
}
