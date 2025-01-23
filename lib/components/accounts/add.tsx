'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { trpc } from '#/lib/trpc/client';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';

function AddAccount() {
  const r = useRouter();

  const sendPhoneCode =
    trpc.sendPhoneCode.useMutation();

  const verifyOtp = trpc.verifyOtp.useMutation();

  const verifyPass =
    trpc.verifyPassword.useMutation();

  const [user, setUser] = useState<{
    id: string;
    firstName: string;
  } | null>(null);

  const [step, setStep] = useState(1);

  const refs = {
    phoneNumber: useRef<HTMLInputElement>(null),
    otp: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  async function handeSendOtp() {
    const phoneNumber =
      refs.phoneNumber.current?.value;

    if (!phoneNumber) {
      toast.error('Please enter phone number');
      return;
    }

    await sendPhoneCode
      .mutateAsync({
        phoneNumber,
      })
      .then(() => {
        setStep(2);
      });
  }

  async function handleVerifyOtp() {
    if (!refs.otp.current) return;
    const otp = refs.otp.current?.value;

    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    await verifyOtp
      .mutateAsync({
        code: otp,
      })
      .then((res) => {
        if (res.error) {
          toast.error(res.error);
          return;
        }

        if (res.next === 'require_password') {
          setStep(3);
        } else {
          if (res.id) {
            setUser({
              id: res.id,
              firstName: res.firstName,
            });
          }
        }
      });
  }

  async function handleVerifyPassword() {
    const password = refs.password.current?.value;

    if (!password) {
      toast.error('Please enter password');
      return;
    }

    await verifyPass
      .mutateAsync({
        password: password,
      })
      .then((res) => {
        if (res.id) {
          setUser({
            id: res.id,
            firstName: res.firstName,
          });
        } else {
          toast.error(
            res.error || 'An error occurred',
          );
        }
      });
  }

  async function handleSaveSession() {
    r.push(`/account/${user?.id}`);
  }

  if (user) {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl">
            Welcome {user.firstName}
          </CardTitle>
          <CardDescription>
            You have successfully signed in
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => {
              handleSaveSession();
            }}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="z-20 w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          Add Account
        </CardTitle>
        <CardDescription>
          Enter your phone number to add account
        </CardDescription>
      </CardHeader>

      {step === 1 ? (
        <CardContent className="flex flex-col gap-4">
          <div>
            <Input
              placeholder="Phone Number"
              ref={refs.phoneNumber}
            />
          </div>
        </CardContent>
      ) : step === 2 ? (
        <CardContent>
          <Input
            placeholder="OTP"
            ref={refs.otp}
          />
        </CardContent>
      ) : (
        <CardContent>
          <Input
            type="password"
            placeholder="Password"
            ref={refs.password}
          />
        </CardContent>
      )}
      <CardFooter className="gap-2">
        {step === 1 && (
          <Button
            onClick={handeSendOtp}
            isLoading={sendPhoneCode.isLoading}
          >
            Send OTP
          </Button>
        )}

        {step === 2 && (
          <Button
            onClick={handleVerifyOtp}
            isLoading={verifyOtp.isLoading}
          >
            Verify OTP
          </Button>
        )}

        {step === 3 && (
          <Button
            onClick={() => {
              handleVerifyPassword();
            }}
            isLoading={verifyPass.isLoading}
          >
            Verify Password
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default AddAccount;
