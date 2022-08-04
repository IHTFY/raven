<script>
  import { currentQuestion } from "../stores.js";
</script>

<div>
  <slot name="grid">
    <span>No Question</span>
  </slot>
  <slot name="answers">
    <span>No Answers</span>
  </slot>
</div>
