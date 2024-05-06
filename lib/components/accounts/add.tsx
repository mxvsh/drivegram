'use client';

import { toast } from 'sonner';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

let resolvers = new Map<string, Function>();

function AddAccount({
  apiId,
  apiHash,
}: {
  apiId: number;
  apiHash: string;
}) {
  const r = useRouter();
  const saveSession =
    trpc.saveAccountSession.useMutation();

  const [client, setClient] =
    useState<TelegramClient | null>(null);

  const [loading, setLoading] = useState(false);

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

    let _client = client;
    if (!_client) {
      (_client = new TelegramClient(
        new StringSession(''),
        apiId,
        apiHash,
        {
          connectionRetries: 5,
        },
      )),
        setClient(_client);
    }
    setLoading(true);

    try {
      await _client.start({
        phoneNumber,
        phoneCode: async () => {
          setStep(2);
          setLoading(false);
          return new Promise((resolve) => {
            resolvers.set('phoneCode', resolve);
          });
        },
        password: async () => {
          setStep(3);
          setLoading(false);
          if (refs.otp.current) {
            refs.otp.current.value = '';
          }
          return new Promise((resolve) => {
            resolvers.set('password', resolve);
          });
        },
        onError: (err) => {
          setLoading(false);
          toast.error(err.message);
        },
      });
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        toast.error(err.message);
      } else toast.error('Failed to send OTP');
      return;
    }

    try {
      setLoading(false);
      const user = await _client.getMe();
      setUser(user);
    } catch (e) {
      toast.error('Failed to get user');
    }
  }

  async function handleVerifyOtp() {
    if (!refs.otp.current) return;
    const otp = refs.otp.current?.value;

    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    const otpResolver =
      resolvers.get('phoneCode');
    if (!otpResolver) return;

    setLoading(true);
    await otpResolver(otp);
  }

  async function handleVerifyPassword(
    skip?: boolean,
  ) {
    const password = refs.password.current?.value;

    if (!password && !skip) {
      toast.error('Please enter password');
      return;
    }

    const passwordResolver =
      resolvers.get('password');

    if (!passwordResolver) return;

    setLoading(true);
    await passwordResolver(password);
  }

  async function handleSaveSession() {
    if (client && user) {
      setLoading(true);
      const session = client.session.save() + '';
      saveSession
        .mutateAsync({
          accountId: user.id?.toString()!,
          name: user.firstName!,
          session,
        })
        .then(() => {
          r.push(`/account/${user.id}`);
        });
    }
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
            // isLoading={loading}
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
            isLoading={loading}
          >
            Send OTP
          </Button>
        )}

        {step === 2 && (
          <Button
            onClick={handleVerifyOtp}
            isLoading={loading}
          >
            Verify OTP
          </Button>
        )}

        {step === 3 && (
          <Button
            onClick={() => {
              handleVerifyPassword();
            }}
            isLoading={loading}
          >
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default AddAccount;
