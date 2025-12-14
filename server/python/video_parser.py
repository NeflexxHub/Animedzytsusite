from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import sys

app = Flask(__name__)
CORS(app)

SOURCES = {}

try:
    from anicli_api.source.animego import Extractor as AnimeGoExtractor
    SOURCES['animego'] = AnimeGoExtractor
except ImportError:
    pass

try:
    from anicli_api.source.anilibria import Extractor as AnilibriaExtractor
    SOURCES['anilibria'] = AnilibriaExtractor
except ImportError:
    pass

try:
    from anicli_api.source.animevost import Extractor as AnimevostExtractor
    SOURCES['animevost'] = AnimevostExtractor
except ImportError:
    pass

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'sources': list(SOURCES.keys())})

@app.route('/sources', methods=['GET'])
def get_sources():
    return jsonify({'sources': list(SOURCES.keys())})

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    source = request.args.get('source', 'animego')
    
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400
    
    if source not in SOURCES:
        return jsonify({'error': f'Source {source} not available', 'available': list(SOURCES.keys())}), 400
    
    try:
        extractor = SOURCES[source]()
        results = extractor.search(query)
        
        formatted_results = []
        for i, result in enumerate(results[:20]):
            formatted_results.append({
                'id': str(i),
                'title': str(result),
                'source': source,
                '_raw_index': i
            })
        
        return jsonify({'results': formatted_results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/anime', methods=['POST'])
def get_anime():
    data = request.get_json()
    source = data.get('source', 'animego')
    query = data.get('query', '')
    index = data.get('index', 0)
    
    if source not in SOURCES:
        return jsonify({'error': f'Source {source} not available'}), 400
    
    try:
        extractor = SOURCES[source]()
        results = extractor.search(query)
        
        if index >= len(results):
            return jsonify({'error': 'Index out of range'}), 400
        
        anime = results[index].get_anime()
        
        return jsonify({
            'title': str(anime) if anime else 'Unknown',
            'source': source
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/episodes', methods=['POST'])
def get_episodes():
    data = request.get_json()
    source = data.get('source', 'animego')
    query = data.get('query', '')
    anime_index = data.get('anime_index', 0)
    
    if source not in SOURCES:
        return jsonify({'error': f'Source {source} not available'}), 400
    
    try:
        extractor = SOURCES[source]()
        results = extractor.search(query)
        
        if anime_index >= len(results):
            return jsonify({'error': 'Anime index out of range'}), 400
        
        anime = results[anime_index].get_anime()
        episodes = anime.get_episodes()
        
        formatted_episodes = []
        for i, ep in enumerate(episodes):
            formatted_episodes.append({
                'id': str(i),
                'number': i + 1,
                'title': str(ep),
                '_raw_index': i
            })
        
        return jsonify({'episodes': formatted_episodes})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/video', methods=['POST'])
def get_video():
    data = request.get_json()
    source = data.get('source', 'animego')
    query = data.get('query', '')
    anime_index = data.get('anime_index', 0)
    episode_index = data.get('episode_index', 0)
    
    if source not in SOURCES:
        return jsonify({'error': f'Source {source} not available'}), 400
    
    try:
        extractor = SOURCES[source]()
        results = extractor.search(query)
        
        if anime_index >= len(results):
            return jsonify({'error': 'Anime index out of range'}), 400
        
        anime = results[anime_index].get_anime()
        episodes = anime.get_episodes()
        
        if episode_index >= len(episodes):
            return jsonify({'error': 'Episode index out of range'}), 400
        
        episode = episodes[episode_index]
        sources_list = episode.get_sources()
        
        videos = []
        for src in sources_list[:5]:
            try:
                video_list = src.get_videos()
                for video in video_list:
                    videos.append({
                        'type': getattr(video, 'type', 'unknown'),
                        'quality': getattr(video, 'quality', 'unknown'),
                        'url': getattr(video, 'url', ''),
                        'headers': getattr(video, 'headers', {})
                    })
            except Exception:
                continue
        
        return jsonify({'videos': videos})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    app.run(host='0.0.0.0', port=port, debug=False)
