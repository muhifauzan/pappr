defmodule Server.EditorServer do
  use GenServer

  @derive Jason.Encoder
  defstruct version: 0, steps: []

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def get_steps_since(version) do
    GenServer.call(__MODULE__, {:get_steps_since, version})
  end

  def apply_steps(steps, version, client_id) do
    GenServer.call(__MODULE__, {:apply_steps, steps, version, client_id})
  end

  ## Callbacks

  @impl true
  def init(_opts) do
    {:ok, %__MODULE__{}}
  end

  @impl true
  def handle_call({:get_steps_since, version}, _from, state) do
    if version >= state.version do
      {:reply, :ok, state}
    else
      steps =
        state.steps
        |> Enum.take(state.version - version)
        |> Enum.reverse()

      client_ids =
        steps
        |> Enum.map(& &1[:client_id])
        |> Enum.reverse()

      {:reply, {:ok, %{version: state.version, steps: steps, client_ids: client_ids}}, state}
    end
  end

  @impl true
  def handle_call({:apply_steps, steps, version, client_id}, _from, state) do
    if version < state.version do
      {:reply, {:error, :version_mismatch}, state}
    else
      new_version = state.version + length(steps)
      steps = Enum.map(steps, &[step: &1, client_id: client_id])
      new_steps = prepend_list(steps, state.steps)
      new_state = %{state | version: new_version, steps: new_steps}
      client_ids = Enum.map(steps, & &1[:client_id])

      {:reply, {:ok, %{version: new_version, steps: steps, client_ids: client_ids}}, new_state}
    end
  end

  ## Privates

  defp prepend_list([], steps) do
    steps
  end

  defp prepend_list([step | tail], steps) do
    prepend_list(tail, [step | steps])
  end
end
