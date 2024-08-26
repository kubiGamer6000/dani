<script lang="ts">
import {user, userData} from "$lib/firebase";

import { Doc, Collection } from "sveltefire";

import * as Card from "$lib/components/ui/card/index.js";
import * as Table from "$lib/components/ui/table/index.js";

import WeekSelector from "$lib/components/WeekSelector.svelte";
</script>


<Card.Root class="mx-auto w-full">
    <Card.Header>
      <Card.Title class="text-3xl">Rota</Card.Title>
      <Card.Description class="text-md"
        >See your rota here.</Card.Description
      >
    </Card.Header>
    <Card.Content>

      
            <div class="py-2">
              <h2 class="text-lg font-semibold">
             
              </h2>
              <Table.Root class="my-4">
                <Table.Header>
                  <Table.Row>
                    <Table.Head class="w-[100px]">Activity</Table.Head>
                    <Table.Head class="text-right">When</Table.Head>
                  </Table.Row>
                </Table.Header>
  
                  <Table.Row>
                    <Table.Cell class="font-medium flex items-center w-48">
                      Checked in
                    </Table.Cell>
                    <Table.Cell class="text-right">
               
                    </Table.Cell>
                  </Table.Row>
  
                  <Table.Row>
                    <Table.Cell
                      class="font-medium text-md flex items-center w-48"
                    >
                      Checked out
                    </Table.Cell>
                    <Table.Cell class="text-right">
                     
                    </Table.Cell>
                  </Table.Row>
        
              </Table.Root>
            </div>
   


        <p class="text-center">Loading...</p>
   
    </Card.Content>
    <!-- <Card.Footer>
      <Button class="w-full">Test</Button>
    </Card.Footer> -->
  </Card.Root>
  









