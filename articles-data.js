window.KT_ARTICLES = [
  {
    id: 1,
    title: "How Modern CPUs Really Execute Code: Pipelines, Caches, and Speculation",
    date: "2025-01-01",
    readTime: 8,
    tags: ["CPU", "Architecture", "Performance"],
    summary: "A practical mental model for how instructions flow through a CPU, why caches matter more than clock speed, and what speculation changes.",
    html: `
      <p>When people first learn programming, it’s easy to imagine a CPU as a simple machine that reads one instruction, executes it, then moves to the next. That picture is useful, but it’s not how modern processors achieve high performance. Today’s CPUs are built to keep multiple parts of the chip busy at the same time, and they do that by overlapping work, predicting the future, and hiding memory latency.</p>
      <h4>1) Pipelines: overlapping the work</h4>
      <p>A pipeline splits instruction processing into stages—fetch, decode, execute, memory access, write-back. Instead of waiting for one instruction to finish all stages, the CPU starts the next instruction while the previous one moves to the next stage. In the ideal case, the pipeline finishes roughly one instruction per cycle, even if each instruction takes several stages to complete.</p>
      <p>The trade‑off is that pipelines are sensitive to hazards. Data hazards happen when one instruction needs the result of another that hasn’t finished yet. Control hazards happen around branches: if the CPU doesn’t know which path to fetch next, it risks stalling. Modern chips add techniques like forwarding (bypassing results directly), and branch prediction to reduce these stalls.</p>
      <h4>2) Caches: the real bottleneck is memory</h4>
      <p>Even a fast core is slow if it has to wait for main memory. Accessing DRAM can take hundreds of cycles. That’s why CPUs have cache hierarchies (L1, L2, L3). The L1 cache is tiny but extremely fast, often delivering data in just a few cycles. L2 and L3 are larger but slower. If data is in cache (a “hit”), execution stays smooth; if not (a “miss”), the core can stall.</p>
      <p>Cache design explains many real‑world performance tips. Sequential memory access patterns can be fast because caches fetch lines of contiguous bytes. Random access can be much slower. Data structures and algorithms that improve locality (like arrays, SoA layouts, or blocking in matrix multiplication) often win even if theoretical complexity is similar.</p>
      <h4>3) Out‑of‑order execution: using idle time</h4>
      <p>When an instruction is waiting—maybe for memory—the CPU doesn’t always sit idle. Out‑of‑order cores track many in‑flight instructions. If an instruction can run safely without violating dependencies, it may execute early. This helps keep functional units busy and improves throughput.</p>
      <p>Out‑of‑order execution relies on renaming registers, reordering buffers, and dependency tracking. To software, it still looks like the program ran in order. Internally, the CPU is constantly reshuffling work to reduce bubbles in the pipeline.</p>
      <h4>4) Speculation and branch prediction</h4>
      <p>Branches break pipelines because the CPU must choose which path to follow before it knows the condition. Predictors guess the most likely path based on history. The CPU then speculatively executes down that path. If the guess is right, great—no stall. If it’s wrong, the CPU discards the speculative work and rolls back to the correct path, costing cycles.</p>
      <p>Speculation is one reason performance can feel “non‑deterministic.” Small code changes can alter branch patterns, cache layout, or instruction scheduling. Benchmarking needs care: measure, repeat, and avoid accidental bias from warm caches or compiler differences.</p>
      <h4>5) A helpful mental model</h4>
      <p>To reason about performance, think in terms of throughput and latency. The CPU wants a steady stream of cache‑friendly data and predictable control flow. When it gets that, it can overlap work and run at high throughput. When it doesn’t—branchy code, cache misses, random memory access—latency dominates and performance collapses.</p>
      <p>This is why “optimize later” is a good default, but also why performance engineering is fascinating: the hardware is doing advanced scheduling and prediction behind the scenes. The best optimizations often come from aligning your code with what the CPU is already trying to do.</p>
    `
  },
  {
    id: 2,
    title: "From Noise to Insight: A Gentle Guide to Signal Processing and FFT",
    date: "2025-01-01",
    readTime: 9,
    tags: ["Math", "DSP", "FFT"],
    summary: "Understand signals, frequency domain thinking, and why the FFT is one of the most useful algorithms in engineering.",
    html: `
      <p>Signal processing sounds intimidating, but the core idea is simple: you have data that varies over time (or space), and you want to transform it to reveal patterns. A microphone records a waveform, a sensor records vibration, and a network monitor records traffic. In the time domain, these signals can look messy. In the frequency domain, structure often appears.</p>
      <h4>1) Time vs. frequency</h4>
      <p>A pure tone at 440 Hz (the musical note A) is a simple sine wave in time. If you add multiple tones together, the time waveform becomes more complex, but each tone still has a distinct frequency. The frequency domain asks: “How much of each frequency is present?” That’s useful for audio equalizers, vibration analysis, and communications.</p>
      <h4>2) The Fourier idea</h4>
      <p>Fourier analysis says many signals can be approximated as sums of sinusoids. The Fourier Transform computes the contribution of different frequencies. For continuous signals, it’s an integral; for sampled data, we use the Discrete Fourier Transform (DFT).</p>
      <p>The DFT takes N time samples and returns N frequency “bins.” Each bin represents a complex number: magnitude (how strong) and phase (alignment). You can plot magnitudes to see which frequencies dominate.</p>
      <h4>3) Why sampling rate matters</h4>
      <p>Sampling converts a continuous signal into discrete points. The sampling rate must be at least twice the highest frequency you care about—this is the Nyquist principle. If you sample too slowly, high‑frequency components fold into lower frequencies, creating aliasing. In practice, systems use low‑pass filters before sampling to reduce aliasing.</p>
      <h4>4) FFT: making the DFT fast</h4>
      <p>A direct DFT is O(N²), which becomes expensive as N grows. The Fast Fourier Transform (FFT) computes the same result in O(N log N) using symmetry and divide‑and‑conquer. That speedup is why FFT powers real‑time audio, image processing, radar, and countless applications.</p>
      <p>Important detail: the FFT doesn’t “magically” add information. It reorganizes computation to be efficient. But it enables you to do frequency‑domain analysis and filtering quickly, which changes what’s feasible.</p>
      <h4>5) Windowing and leakage</h4>
      <p>Real signals are finite segments. The FFT assumes the segment repeats periodically. If the segment doesn’t align nicely with the signal’s period, you get spectral leakage—energy smears across bins. Window functions (Hann, Hamming, Blackman) taper the ends of the segment to reduce leakage. The trade‑off is slightly broader peaks and altered amplitudes.</p>
      <h4>6) A practical workflow</h4>
      <p>If you want to analyze data: choose a sampling rate, capture a segment, apply a window, run the FFT, and interpret peaks. If you want filtering: design a filter (often in frequency domain), apply it, and transform back. Libraries make the computation easy; the real skill is choosing parameters and understanding what the result means.</p>
      <p>Signal processing is one of those areas where math becomes directly visible. When you move between time and frequency, noise and structure stop being abstract—they become shapes you can measure, remove, and use.</p>
    `
  }
];
