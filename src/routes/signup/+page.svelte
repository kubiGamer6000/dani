<script lang="ts">
  import { auth, user, db } from "$lib/firebase";
  import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";

  import { SignedIn, SignedOut } from "sveltefire";

  import { doc, writeBatch } from "firebase/firestore";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import type { UserData } from "$lib/types/user";
  import { page } from "$app/stores";

  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let errorMessage = "";
  let loading = false;

  async function signUpWithEmail() {
    loading = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      await confirmUser(false);
      errorMessage = "";
      const redirectTo = $page.url.searchParams.get("redirectTo") || "/";
      goto(`/${redirectTo.slice(1)}`);
    } catch (error: any) {
      console.error("Error signing up with email/password:", error);
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }

  async function signUpWithGoogle() {
    loading = true;
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);

      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      errorMessage = "";
      await confirmUser(true);
      const redirectTo = $page.url.searchParams.get("redirectTo") || "/";
      goto(`/${redirectTo.slice(1)}`);
    } catch (error: any) {
      console.error("Error signing up with Google:", error);
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }

  async function confirmUser(withGoogle: boolean) {
    const batch = writeBatch(db);

    const newUser = {
      email: withGoogle ? $user!.email : email,
      name: withGoogle ? $user!.displayName : `${firstName} ${lastName}`,
      role: "staff",
      isCheckedIn: false,
      lastCheckIn: null,
      lastCheckInTimestamp: null,
    };

    batch.set(doc(db, "users", $user!.uid), newUser);
    await batch.commit();
  }
</script>

<main
  class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen items-center justify-center"
>
  <h1 class="p-4 text-3xl font-semibold">Dani's Catering 🍆</h1>

  <Card.Root class="mx-auto max-w-sm">
    <Card.Header>
      <SignedIn let:user>
        <Card.Title class="text-2xl">Hey, {user.displayName}</Card.Title>
        <Card.Description
          >You are already logged in. Choose an option below.</Card.Description
        >
      </SignedIn>
      <SignedOut>
        <Card.Title class="text-xl">Sign Up</Card.Title>
        <Card.Description
          >Enter your information to create an account</Card.Description
        >
      </SignedOut>
    </Card.Header>
    <Card.Content>
      <SignedIn let:signOut>
        <div class="grid gap-4">
          <Button
            on:click={() => {
              goto("/staff");
            }}
            class="w-full">Go to app</Button
          >
          <Button
            variant="outline"
            on:click={async () => {
              const res = await fetch("/api/signin", { method: "DELETE" });
              await signOut();
              goto("/login");
            }}
            class="w-full">Log out</Button
          >
        </div>
      </SignedIn>
      <SignedOut>
        <form on:submit|preventDefault={signUpWithEmail} class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="First name"
                required
                bind:value={firstName}
              />
            </div>
            <div class="grid gap-2">
              <Label for="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Last name"
                required
                bind:value={lastName}
              />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              bind:value={email}
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              bind:value={password}
            />
          </div>
          {#if errorMessage}
            <p class="text-red-500 text-sm">{errorMessage}</p>
          {/if}
          <Button type="submit" class="w-full" disabled={loading}>
            {#if loading}Creating account...{:else}Create an account{/if}
          </Button>
          <!-- <Button
            variant="outline"
            class="w-full"
            on:click={signUpWithGoogle}
            disabled={loading}
          >
            {#if loading}Creating account...{:else}Sign up with Google{/if}
          </Button>
        </form> -->
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <a href="/login" class="underline"> Log in </a>
          </div>
        </form></SignedOut
      >
    </Card.Content>
  </Card.Root>
</main>
