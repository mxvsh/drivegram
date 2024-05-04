'use client';

import { toast } from 'sonner';
import type { Api } from 'telegram';

import { useRef, useState } from 'react';

import { trpc } from '#/lib/trpc/client';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';

function SignInForm() {
  const generateOtp =
    trpc.generateOtp.useMutation();
  const verifyOtp = trpc.verifyOtp.useMutation();
  const verifyPassword =
    trpc.verifyPassword.useMutation();

  const [user, setUser] =
    useState<Partial<Api.User> | null>(null);

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
      toast.error('Please fill all fields');
      return;
    }
    await generateOtp.mutateAsync({
      phoneNumber,
    });
    setStep(2);
  }

  async function handleVerifyOtp() {
    if (!refs.otp.current) return;
    const otp = refs.otp.current?.value;

    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    await verifyOtp.mutateAsync(otp);
    refs.otp.current.value = '';
    setStep(3);
  }

  async function handleVerifyPassword() {
    const password = refs.password.current?.value;

    if (!password) {
      toast.error('Please enter password');
      return;
    }

    const user =
      await verifyPassword.mutateAsync(password);
    setUser(user);
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
              window.location.reload();
            }}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          Sign In
        </CardTitle>
        <CardDescription>
          Sign in to your account to continue
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
            defaultValue={''}
            placeholder="Password"
            ref={refs.password}
          />
        </CardContent>
      )}
      <CardFooter className="gap-2">
        {step === 1 && (
          <Button
            onClick={handeSendOtp}
            isLoading={generateOtp.isLoading}
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
            onClick={handleVerifyPassword}
            isLoading={verifyPassword.isLoading}
          >
            Sign In
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default SignInForm;
