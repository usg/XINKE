import React, { Component } from "react";
import {
  CaretRightOutlined,
  PauseOutlined,
} from '@ant-design/icons';

interface AudioState {
  isPlay: boolean,

  allTime: number,
  currentTime: number,
}

interface AudioProps {
  src: string,
  id: string
}

// 语音播放控制
class AudioPlayer extends Component<AudioProps, AudioState> {
  constructor(props: AudioProps) {
    super(props);
    this.state = {
      isPlay: false,

      allTime: 0,
      currentTime: 0,
    };
  }

  // 播放长度
  onCanPlay = () => {
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    this.setState({
      allTime: audio.duration,
    });
  };

  // 播放开始
  playAudio = () => {
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    audio.play();
    this.setState({
      isPlay: true,
    });
  };

  // 播放暂停
  pauseAudio = () => {
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    audio.pause();
    this.setState({
      isPlay: false,
    });
  };

  // 进度控制
  changeTime = (e) => {
    const { value } = e.target;
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    this.setState({
      currentTime: value,
    });

    audio.currentTime = value;
    if (value === audio.duration) {
      this.setState({
        isPlay: false,
      });
    }
  };

  // 已播放时长
  onTimeUpdate = () => {
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);

    this.setState({
      currentTime: audio.currentTime,
    });
    if (audio.currentTime === audio.duration) {
      this.setState({
        isPlay: false,
      });
    }
  };

  formatSecond = (time: number) => {
    const second = Math.floor(time % 60);
    const minite = Math.floor(time / 60);
    return `${minite}:${second >= 10 ? second : `0${second}`}`;
  }

  render() {
    const { src, id } = this.props;
    const {
      isPlay,
      allTime,
      currentTime,
    } = this.state;

    return (
      <div>
        <audio
          id={`audio${id}`}
          src={src}
          onCanPlay={this.onCanPlay}
          onTimeUpdate={this.onTimeUpdate}
        >
          <track src={src} kind="captions" />
        </audio>

        {isPlay ? (
          <span onClick={this.pauseAudio}>  <PauseOutlined /></span>
        ) : (
            <span onClick={this.playAudio}> <CaretRightOutlined /></span>
          )}

        <div>
          <input
            type="range"
            step="0.01"
            max={allTime}
            value={currentTime}
            onChange={this.changeTime}
          />
          <span>
            {`${this.formatSecond(currentTime)} / ${this.formatSecond(allTime)}`}
          </span>
        </div>
      </div>
    );
  }
}

export default AudioPlayer;


