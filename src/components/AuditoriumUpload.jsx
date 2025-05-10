"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #005ac1;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  color: ${({ error }) => (error ? "red" : "green")};
`;

export default function AuditoriumUpload() {
    const fileRef = useRef();
    const [message, setMessage] = useState(null);

    const mutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("http://37.27.215.130:5545/api/db/auditoriums/add-bulk", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZDllMGNjMC1kMjcyLTQyZTctODAwNi0wYjRjMDY1Mjk5YjgiLCJpYXQiOjE3NDY4NTcwNzYsImV4cCI6MTc0Njg1Nzk3Nn0.hbYinpPl4Wdk5_IMACq22ov_3msdXW8mTIuo3YHdQWM`,
                },
            });

            return res.data;
        },
        onSuccess: (data) => {
            setMessage({
                text: `✅ Yuborildi. Muvaffaqiyatli: ${data.results?.length || 0}, Xatoliklar: ${data.errors?.length || 0}`,
                error: false,
            });
        },
        onError: (err) => {
            setMessage({ text: err.response?.data?.error || "❌ Xatolik yuz berdi", error: true });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = fileRef.current?.files[0];
        if (!file) {
            return setMessage({ text: "Iltimos, fayl tanlang", error: true });
        }
        setMessage(null);
        mutation.mutate(file);
    };

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <Label>Excel faylni yuklang (.xlsx)</Label>
                <Input type="file" accept=".xlsx" ref={fileRef} />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Yuklanmoqda..." : "Yuklash"}
                </Button>
            </form>

            {message && <Message error={message.error}>{message.text}</Message>}
        </Wrapper>
    );
}
