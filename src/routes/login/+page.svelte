<script lang="ts">
  import { auth } from "$lib/firebase";
  import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
  } from "firebase/auth";

  import { goto } from "$app/navigation";

  import CircleAlert from "lucide-svelte/icons/circle-alert";

  import { SignedIn, SignedOut } from "sveltefire";

  import { Button } from "$lib/components/ui/button/index.ts";
  import * as Card from "$lib/components/ui/card/index.ts";
  import { Input } from "$lib/components/ui/input/index.ts";
  import { Label } from "$lib/components/ui/label/index.ts";
  import * as Alert from "$lib/components/ui/alert/index.ts";

  import { page } from "$app/stores";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loading = false;

  async function signIn(userCredential: any) {
    const idToken = await userCredential.user.getIdToken();

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    errorMessage = "";
    const redirectTo = $page.url.searchParams.get("redirectTo") || "/";
    goto(`/${redirectTo.slice(1)}`);
  }

  async function signInWithGoogle() {
    loading = true;
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await signIn(userCredential);
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }

  async function signInWithEmail() {
    loading = true;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await signIn(userCredential);
    } catch (error: any) {
      console.error("Error signing in with email/password:", error);
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }
</script>

<main
  class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen items-center justify-center"
>
  <h1 class="p-4 text-3xl font-semibold">Dani's Catering</h1>

  <Card.Root class="mx-auto max-w-sm">
    <Card.Header>
      <SignedIn let:user>
        <Card.Title class="text-2xl">Hey, {user.displayName}</Card.Title>
        <Card.Description
          >You are already logged in. Choose an option below.</Card.Description
        >
      </SignedIn>
      <SignedOut>
        <Card.Title class="text-2xl">Login</Card.Title>
        <Card.Description
          >Enter your email below to login to your account</Card.Description
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
            }}
            class="w-full">Log out</Button
          >
        </div>
      </SignedIn>
      <SignedOut
        ><form on:submit|preventDefault={signInWithEmail} class="grid gap-4">
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
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="##" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              bind:value={password}
            />
          </div>
          {#if errorMessage}
            <Alert.Root variant="destructive">
              <CircleAlert class="h-4 w-4" />
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{errorMessage}</Alert.Description>
            </Alert.Root>
          {/if}
          <Button type="submit" class="w-full" disabled={loading}>
            {#if loading}Logging in...{:else}Login{/if}
          </Button>
          <Button
            variant="outline"
            on:click={signInWithGoogle}
            class="w-full"
            disabled={loading}
          >
            {#if loading}Logging in...{:else}Login with Google{/if}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <a href="/signup" class="underline">Sign up</a>
        </div></SignedOut
      >
    </Card.Content>
  </Card.Root>
</main>
