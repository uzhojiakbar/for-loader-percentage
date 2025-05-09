"use client";
import React, { useEffect, useState } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #0e0e0e;
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    color: #f2f2f2;
  }
`;

// === Keyframes ===
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 112, 243, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(0, 112, 243, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 112, 243, 0); }
`;

// === Styled Components ===
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(14px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const LoaderContainer = styled.div`
  background: rgba(30, 30, 30, 0.9);
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  text-align: center;
  min-width: 300px;
  animation: ${pulse} 2s infinite;
`;

const ProgressCircle = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;
`;

const Circle = styled.svg`
  width: 140px;
  height: 140px;
  transform: rotate(-90deg);
`;

const CircleTrack = styled.circle`
  fill: none;
  stroke: #444;
  stroke-width: 10;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: #00bfff;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 440;
  stroke-dashoffset: ${(props) => 440 - (props.percent / 100) * 440};
  transition: stroke-dashoffset 0.4s ease-out;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 24px;
  font-weight: 700;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  padding: 20px;
  color: #f2f2f2;
  background: #121212;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const DataPreview = styled.pre`
  max-height: 400px;
  overflow-y: auto;
  background: #1e1e1e;
  padding: 15px;
  border-radius: 10px;
  font-size: 15px;
  border: 1px solid #333;
  white-space: pre-wrap;
  word-break: break-word;
  color: #ddd;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #00bfff;
`;

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["largeJson"],
    queryFn: async () => {
      const response = await axios.get("http://37.27.215.130:5545/api/for-test/large-json", {
        responseType: "blob",
        onDownloadProgress: (event) => {
          if (event.lengthComputable && event.total > 0) {
            const percent = ((event.loaded / event.total) * 100).toFixed(1);
            setProgress(parseFloat(percent));
          }
        },
      });
      const text = await response.data.text();
      setIsComplete(true);
      return JSON.parse(text);
    },
  });

  return (
    <>
      <GlobalStyle />

      {!isComplete && (
        <ModalOverlay>
          <LoaderContainer>
            <ProgressCircle>
              <Circle>
                <CircleTrack r="70" cx="70" cy="70" />
                <CircleProgress r="70" cx="70" cy="70" percent={progress || 1} />
              </Circle>
              <ProgressText>{progress.toFixed(1)}%</ProgressText>
            </ProgressCircle>
            <p style={{ marginTop: "20px", fontWeight: 500, color: "#ccc" }}>
              Ma'lumotlar yuklanmoqda...
            </p>
          </LoaderContainer>
        </ModalOverlay>
      )}

      <Container>
        <Title>Katta JSON Yuklandi</Title>
        {error && <p style={{ color: "red" }}>Xatolik yuz berdi: {error.message}</p>}
        {data && <DataPreview>{JSON.stringify(data, null, 2)}</DataPreview>}
      </Container>
    </>
  );
}
